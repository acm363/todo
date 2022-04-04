import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @Get()
  findAll() {
    return this.todolistService.findAll();
  }

  @Get(':todoId')
  findOne(@Param('todoId') todoId: number) {
    console.log(
      "récupération de la todo d'id : " +
        todoId +
        ' type(' +
        typeof todoId +
        ')',
    );
    return this.todolistService.findOne(todoId);
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    console.log(
      `création d'une todo -- ${createTodoDto instanceof CreateTodoDto}`,
    );
    return this.todolistService.create(createTodoDto);
  }
  @Delete(':todoId')
  remove(@Param('todoId') todoId: number) {
    return this.todolistService.remove(todoId);
  }

  @Delete()
  removeAll() {
    return this.todolistService.removeAll();
  }
}
