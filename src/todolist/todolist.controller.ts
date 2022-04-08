import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @Get()
  findAll() {
    console.log(`\n Récupération de toutes les TODO`);
    return this.todolistService.findAll();
  }

  @Get(':todoId')
  findOne(@Param('todoId') todoId: number) {
    console.log(
      "\n Récupération de la todo d'id : " +
        todoId +
        ' type(' +
        typeof todoId +
        ')',
    );
    return this.todolistService.findOne(todoId);
  }

  @Post()
  @UseFilters(HttpExceptionFilter)
  create(@Body() createTodoDto: CreateTodoDto) {
    console.log(`\n Création d'une todo -- `);
    return this.todolistService.create(createTodoDto);
  }

  @Patch(':todoId')
  update(@Param('todoId') todoId: number, updateTodoDto: UpdateTodoDto) {
    console.log(`\n Modification de la TODO de todoId : ${todoId} `);
  }

  @Delete(':todoId')
  remove(@Param('todoId') todoId: number) {
    console.log(`\n Suppression de la TODO de todoId : ${todoId} `);
    return this.todolistService.remove(todoId);
  }

  @Delete()
  removeAll() {
    console.log(`\n Suppression de toutes les TODO`);
    return this.todolistService.removeAll();
  }
}
