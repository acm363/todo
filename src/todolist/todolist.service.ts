import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodolistService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
  ) {}

  findAll() {
    return this.todoModel.find().exec();
  }

  async findOne(id: number) {
    const todo = await this.todoModel.find({ todoId: id }).exec();
    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found in the database!`);
    }
    return todo;
  }


  // s'inspirer du preload by name flavors pour les tasks
  create(createTodoDto: CreateTodoDto) {
    const todo = new this.todoModel({
      ...createTodoDto,
      createdAt: new Date(),
    });
    return todo.save();
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const existingTodo = await this.todoModel
      .findOneAndUpdate({ todoId: id }, { $set: updateTodoDto }, { new: true })
      .exec();
    if (!existingTodo) {
      throw new NotFoundException(`Todo #${id} not found in the database`);
    }
    return existingTodo;
  }

  async remove(id: number) {
    const todo = await this.todoModel.findOneAndDelete({ todoId: id }).exec();
    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found in the database`);
    }
    return todo;
  }

  removeAll() {
    return this.todoModel.deleteMany();
  }

  // ici on va modifier l'état de la tache d'id taskId
  // en front end, l'utilisateur ne verra par exemple que des boutons permettant de
  // changer les états, en back-end nous transférerons les messages correspondants aux boutons
  // async setTaskState(id: string, taskId: string, taskState: string) {}
}
