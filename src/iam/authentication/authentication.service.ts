import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const existingUser = await this.userModel.findOne({
        email: signUpDto.email,
      });
      if (existingUser) {
        throw new ConflictException('User exists with the given email');
      }

      const user = new this.userModel({
        username: signUpDto.username,
        email: signUpDto.email,
        passwordHash: await this.hashingService.hash(signUpDto.password),
      });

      await user.save();
    } catch (err) {
      console.error(`Error in signUp authentication service: ${err}`);
      throw err;
    }
  }

  async signIn(signInDto: SignInDto) {
    try {
      const user = await this.userModel.findOne({ email: signInDto.email });
      if (!user) {
        throw new UnauthorizedException('User does not exist');
      }

      const isEqual = await this.hashingService.compare(
        signInDto.password,
        user.passwordHash,
      );
      if (!isEqual) {
        throw new UnauthorizedException('Password does not match');
      }

      return await this.generateTokens(user);
    } catch (err) {
      console.error(`Error in signIn authentication service: ${err}`);
      throw err;
    }
  }

  public async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(user._id, this.jwtConfiguration.accessTokenTtl, {
        email: user.email,
      }),
      this.signToken(user._id, this.jwtConfiguration.refreshTokenTtl),
    ]);
    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshTokensDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokensDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );

      const user = await this.userModel.findById(sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      console.error(`Error in refreshTokens authentication service: ${error}`);
      throw new UnauthorizedException();
    }
  }

  private async signToken(userId: string, expiresIn: number, payload?) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
