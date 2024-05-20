import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AccessTokenGuard } from './iam/authentication/guards/access-token.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
