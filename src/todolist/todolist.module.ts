import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './entities/todo.entity';
import { TodoListController } from './todo-list.controller';
import { TodoListService } from './todo-list.service';
import { TodoListRepository } from './todo-list-repository.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Todo.name,
        schema: TodoSchema,
      },
    ]),
  ],
  controllers: [TodoListController],
  providers: [TodoListService, TodoListRepository],
})
export class TodolistModule {}
