import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskStatus } from './entities/task.entity';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  findAll() {
    return this.taskModel.find().exec();
  }

  createTask(task_title: string) {
    console.log('création des tâches');
    const task = new this.taskModel({
      title: task_title,
      status: TaskStatus.TODO,
    });
    return task.save();
  }

  async changeStatusToDone(taskId: string) {
    const existingTask = await this.taskModel.findByIdAndUpdate(
      taskId,
      {
        $set: {
          status: TaskStatus.DONE,
        },
      },
      { new: true },
    );
    return existingTask;
  }

  async changeStatusToTodo(taskId: string) {
    const existingTask = await this.taskModel.findByIdAndUpdate(
      taskId,
      {
        $set: {
          status: TaskStatus.TODO,
        },
      },
      { new: true },
    );
    return existingTask;
  }

  async remove(id: string) {
    const task = await this.taskModel.findByIdAndDelete(id).exec();
    if (!task) {
      throw new NotFoundException(`Task #${id} not found in the database`);
    }
    return task;
  }

  removeAll() {
    return this.taskModel.deleteMany();
  }
}
