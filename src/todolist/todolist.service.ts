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
import { UpdateTodoIdTaskIdDto } from '../task/dto/todoId-taskId.dto';
import { TaskService } from '../task/task.service';
import * as mongoose from 'mongoose';

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

  async updateTaskToDone(updateTodoIdTaskIdDto: UpdateTodoIdTaskIdDto) {
    console.log(` try to complete task : ${updateTodoIdTaskIdDto.taskId}`);
    if (updateTodoIdTaskIdDto.todoId.length !== ID_LEN) {
      throw new BadRequestException(
        'Given todoId is incorrect (non required id size)',
      );
    }
    const existingTodo = await this.todoModel.findById(
      updateTodoIdTaskIdDto.todoId,
    );
    if (!existingTodo) {
      console.log(' Cannot complete the task!');
      throw new NotFoundException(
        `Todo #${updateTodoIdTaskIdDto.todoId} with taskId #${updateTodoIdTaskIdDto.taskId} not found in the database`,
      );
    }

    if (
      existingTodo.tasks.includes(
        new mongoose.Types.ObjectId(updateTodoIdTaskIdDto.taskId),
      )
    ) {
      await this.taskService.changeStatusToDone(updateTodoIdTaskIdDto.taskId);
      console.log(
        ' task status change to Todo ' +
          new mongoose.Types.ObjectId(updateTodoIdTaskIdDto.taskId),
      );
      console.log(' task completed');

      return existingTodo;
    } else {
      throw new NotFoundException(
        `Task #${updateTodoIdTaskIdDto.taskId} isn't a task of #${updateTodoIdTaskIdDto.todoId}`,
      );
    }
  }

  async updateTaskToTodo(updateTodoIdTaskIdDto: UpdateTodoIdTaskIdDto) {
    console.log(
      ` try to change the task status : ${updateTodoIdTaskIdDto.taskId}`,
    );
    if (updateTodoIdTaskIdDto.todoId.length !== ID_LEN) {
      throw new BadRequestException(
        'Given todoId is incorrect (non required id size)',
      );
    }
    const existingTodo = await this.todoModel.findById(
      updateTodoIdTaskIdDto.todoId,
    );
    if (!existingTodo) {
      console.log(' Cannot complete the task!');
      throw new NotFoundException(
        `Todo #${updateTodoIdTaskIdDto.todoId} with taskId #${updateTodoIdTaskIdDto.taskId} not found in the database`,
      );
    }
    const taskId_ = new mongoose.Types.ObjectId(updateTodoIdTaskIdDto.taskId);
    if (existingTodo.tasks.includes(taskId_)) {
      await this.taskService.changeStatusToTodo(updateTodoIdTaskIdDto.taskId);
      console.log(
        ' task status change to Todo ' +
          new mongoose.Types.ObjectId(updateTodoIdTaskIdDto.taskId),
      );
      return existingTodo;
    } else {
      throw new NotFoundException(
        `Task #${updateTodoIdTaskIdDto.taskId} isn't a task of #${updateTodoIdTaskIdDto.todoId}`,
      );
    }
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
