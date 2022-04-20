import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodolistModule } from './todolist/todolist.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { HeadersMiddleware } from './common/middleware/headers.middleware';
import { TodoListController } from './todolist/todo-list.controller';

@Module({
  imports: [TodolistModule, MongooseModule.forRoot('mongodb://localhost:27017/todo-list'), ConfigModule.forRoot(), CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HeadersMiddleware).forRoutes(TodoListController);
  }
}
