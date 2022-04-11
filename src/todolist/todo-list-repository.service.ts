import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateTodoDto } from './dto/todoDto';

@Injectable()
export class TodoListRepository {
  constructor(@InjectModel(Todo.name) private readonly todoModel: Model<Todo>) {}

  public async create(todo: Todo): Promise<Todo> {
    return await this.todoModel.create(todo);
  }

  public async findAll(): Promise<Todo[]> {
    return this.todoModel.find();
  }

  public async findOne(publicId: string): Promise<Todo> {
    const todo = this.todoModel.findOne({ publicId: publicId });
    if (!todo) {
      throw new NotFoundException(`Todo with publicId #${publicId} not found in the database!`);
    }
    return todo;
  }

  // public async updateTodo(publicId: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
  //   const existingTodo = await this.todoModel
  //     .findOneAndUpdate({ publicId: publicId }, { $set: updateTodoDto }, { new: true })
  //     .exec();
  //   if (!existingTodo) {
  //     throw new NotFoundException(`Todo with publicId #${publicId} not found in the database!`);
  //   }
  //   return existingTodo;
  // }

  public async remove(publicId: string): Promise<Todo> {
    return this.todoModel.findOneAndRemove({ publicId: publicId });
  }
}
