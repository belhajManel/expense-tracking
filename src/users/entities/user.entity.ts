import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  passwordHash: string;
  @Prop({ default: false })
  isActive: boolean;
  @Prop()
  createdAt?: Date;
  @Prop()
  updateddAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
