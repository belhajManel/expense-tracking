import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class ReportsService {
  constructor(private readonly transactionsService: TransactionsService) {}
  async generatePdf(paginationQuery: PaginationQueryDto): Promise<Buffer> {
    const transactionStats =
      await this.transactionsService.getExpensesPerCategory(paginationQuery);
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      doc.fontSize(12).text('Category', 50, 30);
      doc.fontSize(12).text('Total Expenses', 250, 30);
      transactionStats.forEach((category) => {
        const totalExpenses = category.totalExpenses;

        doc.fontSize(12).text(category._id, 50, 60 + category._id.length * 15);

        doc
          .fontSize(12)
          .text(totalExpenses.toFixed(2), 250, 60 + category._id.length * 15);

        doc.moveDown(20);
      });
      doc.end();
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
    });

    return pdfBuffer;
  }
}
