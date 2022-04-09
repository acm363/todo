import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Task, TaskStatus } from '../tasklist/entities/task.entity';
import { ID_LEN } from './todolist.constant';
import { UpdateStateTaskDto } from '../tasklist/dto/update-state-task.dto';

@Injectable()
export class TodolistService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  findAll() {
    return this.todoModel.find().populate('task').exec();
  }

  async findOne(id: string) {
    if (id.length !== ID_LEN) {
      throw new BadRequestException(
        'Given id is incorrect (non required id size)',
      );
    }
    const todo = await this.todoModel.findById(id).populate('task').exec();

    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found in the database!`);
    }

    return todo;
  }

  async createTask(task_title: string) {
    console.log('création des tâches');
    const task = new this.taskModel({
      title: task_title,
      status: TaskStatus.TODO,
    });
    return task.save();
  }

  async create(createTodoDto: CreateTodoDto) {
    console.log('tentative de création');
    const task = await this.createTask(createTodoDto.task);
    console.log(`task : ${task}`);
    const todo = new this.todoModel({
      title: createTodoDto.title,
      task: task._id,
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

  async updateTaskToCompleted(updateStateTaskDto: UpdateStateTaskDto) {
    console.log(` try to complete task : ${updateStateTaskDto.taskId}`);
    const existingTodo = await this.todoModel.findById(
      updateStateTaskDto.todoId,
    );
    if (!existingTodo) {
      console.log(' Cannot complete the task!');
      throw new NotFoundException(
        `Todo #${updateStateTaskDto.todoId} with taskId #${updateStateTaskDto.taskId} not found in the database`,
      );
    }
    const existingTask = await this.taskModel.findByIdAndUpdate(
      updateStateTaskDto.taskId,
      {
        $set: {
          status: TaskStatus.Completed,
        },
      },
    );
    console.log(' task completed');
    return existingTodo;
  }

  async remove(id: string) {
    const todo = await this.todoModel.findByIdAndDelete(id).exec();
    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found in the database`);
    }
    return todo;
  }

  removeAll() {
    return this.todoModel.deleteMany();
  }
}
