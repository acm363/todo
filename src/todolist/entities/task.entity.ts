import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Task extends Document {
  @Prop()
  taskId: number;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

export enum TaskStatus {
  Active = 'Active',
  NotStarted = 'Not Started',
  Completed = 'Completed',
}
