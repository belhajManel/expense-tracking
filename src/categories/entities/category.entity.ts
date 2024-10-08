import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose from 'mongoose';
// import { User } from 'src/users/entities/user.entity';

@Schema({ timestamps: true })
export class Category {
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  // userId: User;
  @Prop({ required: true })
  name: string;
  @Prop({ default: 0 })
  budgetLimit: number;
  @Prop({ default: 0 })
  currentExpenses: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
