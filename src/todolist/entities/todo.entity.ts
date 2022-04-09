import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsString } from 'class-validator';

@Schema()
export class Todo extends Document {
  @Prop()
  title: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Task' })
  tasks: [mongoose.Schema.Types.ObjectId];

  @Prop()
  @IsString()
  createdAt: string;
}
export const TodoSchema = SchemaFactory.createForClass(Todo);
