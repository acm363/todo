import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { timestamp } from 'rxjs';
import { Document } from 'mongoose';
@Schema()
export class Todo extends Document {
  @Prop({ unique: true })
  todoId: number;

  @Prop()
  title: string;

  @Prop([String])
  tasks: string[];

  @Prop()
  createdAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
