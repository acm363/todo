import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus, Todo } from './entities/todo.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateTaskDto, UpdateTodoDto } from './dto/todoDto';

@Injectable()
export class TodoListRepository {
  constructor(@InjectModel(Todo.name) private readonly todoModel: Model<Todo>) {}

  public async create(todo: Todo): Promise<Todo> {
    return await this.todoModel.create(todo);
  }

  public async findAll(): Promise<Todo[]> {
    return this.todoModel.find().exec();
  }

  public async findOne(publicId: string): Promise<Todo> {
    const todo = this.todoModel.findOne({ publicId: publicId }).exec();
    if (!todo) {
      throw new NotFoundException(`Todo with publicId #${publicId} not found in the database!`);
    }
    return todo;
  }
  public async save(todo: Todo): Promise <Todo>{
    return this.todoModel.findOneAndUpdate({publicId: todo.publicId}, todo);
  }

  public async remove(publicId: string): Promise<Todo> {
    const todo = await this.todoModel.findOneAndRemove({ publicId: publicId }).exec();
    if (!todo) {
      throw new NotFoundException(`Todo with publicId #${publicId} not found in the database!`);
    }
    return todo;
  }

  public async removeAll(){
    return await this.todoModel.deleteMany().exec();
  }


}
