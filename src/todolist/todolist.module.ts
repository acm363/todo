import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './entities/todo.entity';
import { TodolistController } from './todolist.controller';
import { TodolistService } from './todolist.service';
import { Task, TaskSchema } from '../task/entities/task.entity';
import { TaskService } from '../task/task.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Todo.name,
        schema: TodoSchema,
      },
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
  ],
  controllers: [TodolistController],
  providers: [TodolistService, TaskService],
})
export class TodolistModule {}
