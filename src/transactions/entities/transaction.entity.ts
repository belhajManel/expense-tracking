import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema({ timestamps: true })
export class Transaction {
  //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  //userId: User;
  @Prop({ required: true })
  amount: number;
  @Prop({ required: true })
  date: Date;
  @Prop({ required: true })
  category: string;
  @Prop({ required: true })
  description: string;
  @Prop([String])
  tags?: string[];
  @Prop()
  createdAt?: Date;
  @Prop()
  updateddAt?: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
