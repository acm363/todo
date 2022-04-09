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
import { UpdateTodoIdTaskId } from '../task/dto/todoId-taskId.dto';

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

  @Patch(':todoID')
  @Header('Returned-At', new Date().toLocaleString())
  update(
    @Param('todoID') todoID: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    console.log(`\n Modification de la TODO de id : ${todoID} `);
    return this.todolistService.update(todoID, updateTodoDto);
  }

  @Patch()
  @Header('Returned-At', new Date().toLocaleString())
  updateTaskStateToDone(@Body() updateTodoIdTaskId: UpdateTodoIdTaskId) {
    console.log(
      `\n Modification de l'état de tâche d'id #${updateTodoIdTaskId.taskId} !`,
    );
    return this.todolistService.updateTaskToDone(updateTodoIdTaskId);
  }

  @Delete(':id')
  @Header('Returned-At', new Date().toLocaleString())
  removeTodo(@Param('id') id: string) {
    console.log(`\n Suppression de la TODO d'id : ${id} `);
    return this.todolistService.remove(id);
  }

  // @Delete('/delete')
  // @Header('Returned-At', new Date().toLocaleString())
  // removeTaskFromTodo(@Body() updateTodoIdTaskId: UpdateTodoIdTaskId) {
  //   console.log(
  //     `\n Suppression de la Tâche d'id : ${updateTodoIdTaskId.taskId} dans la Todo  d'id ${updateTodoIdTaskId.todoId} `,
  //   );
  // }

  @Delete()
  @Header('Returned-At', new Date().toLocaleString())
  removeAll() {
    console.log(
      `\n Suppression de toutes les TODO (ainsi que de leurs tâches! )`,
    );
    return this.todolistService.removeAll();
  }
}
