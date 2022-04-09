import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TaskStatus {
  TODO = 'Todo',
  Completed = 'Completed',
}

@Schema()
export class Task extends Document {
  @Prop()
  title: string;

  @Prop()
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
