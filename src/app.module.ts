import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TodolistModule } from './todolist/todolist.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { TaskListService } from './tasklist/tasklist.service';

@Module({
  imports: [
    TodolistModule,
    MongooseModule.forRoot('mongodb://localhost:27018/todo-list'),
    ConfigModule.forRoot(),
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService, TaskListService],
})
export class AppModule {}
