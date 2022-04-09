import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UpdateStateTaskDto } from '../tasklist/dto/update-state-task.dto';

@Controller('todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @Get()
  @Header('Returned-At', new Date().toLocaleString())
  findAll() {
    console.log(`\n Récupération de toutes les TODO`);
    return this.todolistService.findAll();
  }

  @Get(':id')
  @Header('Returned-At', new Date().toLocaleString())
  findOne(@Param('id') id: string) {
    console.log(
      "\n Récupération de la todo d'id : " + id + ' type(' + typeof id + ')',
    );
    return this.todolistService.findOne(id);
  }

  @Post()
  @Header('Returned-At', new Date().toLocaleString())
  create(@Body() createTodoDto: CreateTodoDto) {
    console.log(`\n Création d'une todo -- ${JSON.stringify(createTodoDto)}`);
    return this.todolistService.create(createTodoDto);
  }

  @Patch(':id')
  @Header('Returned-At', new Date().toLocaleString())
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    console.log(`\n Modification de la TODO de id : ${id} `);
    return this.todolistService.update(id, updateTodoDto);
  }

  @Patch()
  @Header('Returned-At', new Date().toLocaleString())
  updateTaskStateToCompleted(@Body() updateStateTaskDto: UpdateStateTaskDto) {
    console.log(
      `\n Modification de l'état de tâche d'id #${updateStateTaskDto} !`,
    );
    return this.todolistService.updateTaskToCompleted(updateStateTaskDto);
  }

  @Delete(':id')
  @Header('Returned-At', new Date().toLocaleString())
  remove(@Param('id') id: string) {
    console.log(`\n Suppression de la TODO de id : ${id} `);
    return this.todolistService.remove(id);
  }

  @Delete()
  @Header('Returned-At', new Date().toLocaleString())
  removeAll() {
    console.log(`\n Suppression de toutes les TODO`);
    return this.todolistService.removeAll();
  }
}
