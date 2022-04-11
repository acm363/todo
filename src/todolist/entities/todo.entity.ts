import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString } from 'class-validator';

@Schema()
export class Todo {
  @Prop()
  publicId: string;

  @Prop()
  title: string;

  @Prop()
  tasks: TodoTask[];

  @Prop()
  @IsString()
  createdAt: Date;
}

export class TodoTask {
  @Prop()
  label: string;
  @Prop()
  status: TaskStatus;
}

export enum TaskStatus {
  TODO = 'Todo',
  DONE = 'Done',
}

export type TodoDocument = Todo & Document;
export const TodoSchema = SchemaFactory.createForClass(Todo);
