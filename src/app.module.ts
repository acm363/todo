import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TodolistModule } from './todolist/todolist.module';

@Module({
  imports: [
    TodolistModule,
    MongooseModule.forRoot('mongodb://localhost:27018/todo-list'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
