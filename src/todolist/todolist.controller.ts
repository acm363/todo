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
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @Get()
  findAll() {
    console.log(`\n Récupération de toutes les TODO`);
    return this.todolistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(
      "\n Récupération de la todo d'id : " + id + ' type(' + typeof id + ')',
    );
    return this.todolistService.findOne(id);
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    console.log(`\n Création d'une todo -- ${JSON.stringify(createTodoDto)}`);
    return this.todolistService.create(createTodoDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    console.log(`\n Modification de la TODO de id : ${id} `);
    return this.todolistService.update(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log(`\n Suppression de la TODO de id : ${id} `);
    return this.todolistService.remove(id);
  }

  @Delete()
  removeAll() {
    console.log(`\n Suppression de toutes les TODO`);
    return this.todolistService.removeAll();
  }
}
