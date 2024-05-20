import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Document } from 'mongoose';
@Schema({timestamps: true})
export class PlannedExpense extends Document {
  @Prop({ required: true })
  amount: number;
  @Prop({ required: true })
  date: Date;
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;
  @Prop({ required: true })
  description: string;
}
export const PlannedExpenseSchema = SchemaFactory.createForClass(PlannedExpense);
