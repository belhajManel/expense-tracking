import { Controller, Get, Query, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getPdf(
    @Query() paginationQuery: PaginationQueryDto,
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.generatePdf(paginationQuery);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=example.pdf',
    });

    res.end(buffer);
  }
}
