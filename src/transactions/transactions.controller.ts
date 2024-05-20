import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/iam/authentication/guards/access-token.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new FileTypeValidator({
            fileType: 'csv',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.transactionsService.uploadTransaction(
      file.buffer.toString(),
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('stats')
  getExpensesStats(@Query() paginationQuery: PaginationQueryDto) {
    return this.transactionsService.getExpensesPerCategory(paginationQuery);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.transactionsService.findAll(paginationQuery);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
}
