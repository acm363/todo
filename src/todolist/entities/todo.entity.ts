import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Task } from './task.entity';
import * as mongoose from 'mongoose';

@Schema()
export class Todo extends Document {
  @Prop()
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task' })
  task: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date })
  createdAt: Date;
}
export const TodoSchema = SchemaFactory.createForClass(Todo);
