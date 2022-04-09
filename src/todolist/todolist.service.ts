import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ID_LEN } from './todolist.constant';
import { UpdateTodoIdTaskId } from '../task/dto/todoId-taskId.dto';
import { TaskService } from '../task/task.service';

@Injectable()
export class TodolistService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
    private readonly taskService: TaskService,
  ) {}

  findAll() {
    return this.todoModel.find().populate('tasks').exec();
  }

  async findOne(id: string) {
    if (id.length !== ID_LEN) {
      throw new BadRequestException(
        'Given id is incorrect (non required id size)',
      );
    }
    const todo = await this.todoModel.findById(id).populate('tasks').exec();

    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found in the database!`);
    }

    return todo;
  }

  // async createTask(task_title: string) {
  //   console.log('création des tâches');
  //   const task = new this.taskModel({
  //     title: task_title,
  //     status: TaskStatus.TODO,
  //   });
  //   return task.save();
  // }

  async create(createTodoDto: CreateTodoDto) {
    console.log('tentative de création');
    const tasks = [];

    for (let i = 0; i < createTodoDto.tasks.length; i++) {
      tasks.push(await this.taskService.createTask(createTodoDto.tasks[i]));
    }

    console.log(`tasks : ${tasks}`);
    const tasks_id_list = tasks.map((task) => {
      return task._id;
    });
    console.log(`tasks id list : ${tasks_id_list}`);
    const todo = new this.todoModel({
      title: createTodoDto.title,
      tasks: tasks_id_list,
      createdAt: new Date().toLocaleString(),
    });
    if (todo) {
      console.log(`\t création ok!`);
    }
    return todo.save();
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    console.log(`existing : ${updateTodoDto}`);
    const existingTodo = await this.todoModel
      .findByIdAndUpdate(id, { $set: updateTodoDto }, { new: true })
      .exec();
    if (!existingTodo) {
      throw new NotFoundException(`Todo #${id} not found in the database`);
    }
    return existingTodo;
  }

  async updateTaskToDone(updateTodoIdTaskId: UpdateTodoIdTaskId) {
    console.log(` try to complete task : ${updateTodoIdTaskId.taskId}`);
    const existingTodo = await this.todoModel.findById(
      updateTodoIdTaskId.todoId,
    );
    if (!existingTodo) {
      console.log(' Cannot complete the task!');
      throw new NotFoundException(
        `Todo #${updateTodoIdTaskId.todoId} with taskId #${updateTodoIdTaskId.taskId} not found in the database`,
      );
    }
    await this.taskService.changeStatusToDone(updateTodoIdTaskId.taskId);
    console.log(' task completed');
    return existingTodo;
  }

  async updateTaskToTodo(updateTodoIdTaskId: UpdateTodoIdTaskId) {
    console.log(
      ` try to change the task status : ${updateTodoIdTaskId.taskId}`,
    );
    const existingTodo = await this.todoModel.findById(
      updateTodoIdTaskId.todoId,
    );
    if (!existingTodo) {
      console.log(' Cannot complete the task!');
      throw new NotFoundException(
        `Todo #${updateTodoIdTaskId.todoId} with taskId #${updateTodoIdTaskId.taskId} not found in the database`,
      );
    }
    await this.taskService.changeStatusToTodo(updateTodoIdTaskId.taskId);
    console.log(' task status change to Todo');
    return existingTodo;
  }

  // async removeTaskFromTodo(updateTodoIdTaskId: UpdateTodoIdTaskId) {
  //   console.log(` try to delete task : ${updateTodoIdTaskId.taskId}`);
  //   const existingTodo = await this.todoModel.findById(
  //     updateTodoIdTaskId.todoId,
  //   );
  //   if (!existingTodo) {
  //     console.log(' Cannot complete the task!');
  //     throw new NotFoundException(
  //       `Todo #${updateTodoIdTaskId.todoId} with taskId #${updateTodoIdTaskId.taskId} not found in the database`,
  //     );
  //   }
  //   console.log(' task deleted');
  //   return await this.taskService.remove(updateTodoIdTaskId.taskId);
  // }

  async remove(id: string) {
    let todo = await this.todoModel.findById(id).exec();
    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found in the database`);
    }
    todo.tasks.forEach((taskId) => {
      this.taskService.remove(String(taskId));
    });
    todo = await this.todoModel.findByIdAndDelete(id);

    return todo;
  }

  async removeAll() {
    await this.taskService.removeAll();
    return this.todoModel.deleteMany();
  }
}
