import { Injectable } from '@nestjs/common';
import { Todo, TodoDocument } from './entities/todo.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TodoListRepository {
  constructor(@InjectModel(Todo.name) private readonly todoModel: Model<Todo>) {}

  public async create(todo: Todo): Promise<Todo> {
    return await this.todoModel.create(todo);
  }

  public async findAll(): Promise<Todo[]> {
    return await this.todoModel.find().exec();
  }

  public async findOne(todoId: string): Promise<Todo> {
    return await this.todoModel
      .findOne()
      .where({
        todoId: todoId,
      }).setOptions({
          strict: true
        })
      .exec();
  }

  public async save(todo: Todo): Promise<Todo> {
    const todoDocument = (todo as TodoDocument)
    todoDocument.markModified('tasks');
    return todoDocument.save();
  }

  public async remove(publicId: string): Promise<boolean> {
    const todo = await this.todoModel.findOneAndRemove({ publicId: publicId }).exec();
    return !!todo;
  }

  public async removeAll(): Promise<boolean> {
    const deleteResult = await this.todoModel.deleteMany().exec();
    return deleteResult.deletedCount > 0;
  }
}
