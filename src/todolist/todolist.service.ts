import {
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
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

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
    const todo = await this.todoModel.find({ id_: id }).populate('task').exec();
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
      createdAt: new Date().toISOString(),
    });
    if (todo) {
      console.log(`\t création ok!`);
    }
    return todo.save();
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    console.log(`existing : ${updateTodoDto}`);
    const existingTodo = await this.todoModel
      .findByIdAndUpdate({ _id: id }, { $set: updateTodoDto }, { new: true })
      .exec();
    if (!existingTodo) {
      throw new NotFoundException(`Todo #${id} not found in the database`);
    }
    return existingTodo;
  }

  async remove(id: string) {
    const todo = await this.todoModel.findOneAndDelete({ id_: id }).exec();
    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found in the database`);
    }
    return todo;
  }

  removeAll() {
    return this.todoModel.deleteMany();
  }
}
