import { Controller, Delete, Get, Header } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @Header('Returned-At', new Date().toLocaleString())
  findAll() {
    console.log(`\n Récupération de toutes les Tâches`);
    return this.taskService.findAll();
  }

  @Delete()
  @Header('Returned-At', new Date().toLocaleString())
  deleteAll() {
    console.log(`Suppression de toutes les tâches`);
    return this.taskService.removeAll();
  }
}
