import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//import { Document } from 'mongoose';
@Schema({timestamps: true})
export class PlannedExpense {
  @Prop({ required: true })
  amount: number;
  @Prop({ required: true })
  date: Date;
  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  description: string;
}
export const PlannedExpenseSchema = SchemaFactory.createForClass(PlannedExpense);
