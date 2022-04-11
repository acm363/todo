import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodolistModule } from './todolist/todolist.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TodolistModule,
    MongooseModule.forRoot('mongodb://localhost:27017/todo-list'),
    ConfigModule.forRoot(),
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
