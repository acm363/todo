import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus, Todo, TodoTask } from './entities/todo.entity';
import { TodoListRepository } from './todo-list-repository.service';
import { CreateTodoDto, UpdateTodoDto } from './dto/todoDto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TodoListService {
  constructor(private readonly todoRepository: TodoListRepository) {}

  public async findAll(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  public async findOne(todoId: string): Promise<Todo> {
    const todo = await this.todoRepository.findOne(todoId);
    if (todo) {
      return todo;
    }
    throw new NotFoundException(
      `Todo with todoId #${todoId} not found in the database!`,
    );
  }

  public async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = new Todo();
    todo.todoId = uuidv4();
    todo.title = createTodoDto.title;
    todo.createdAt = new Date(); // we want the date be saved in the same format whatever the base
    todo.tasks = createTodoDto.tasks.map((task) => {
      return {
        label: task,
        status: TaskStatus.TODO, // By default, we want all new task to be in this state.
      } as TodoTask;
    });
    return this.todoRepository.create(todo);
  }

  public async updateTodo(
    todoId: string,
    updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    const existingTodo = await this.todoRepository.findOne(todoId);
    if (!existingTodo) {
      throw new NotFoundException(
        `Todo with todoId #${todoId} not found in the database!`,
      );
    }

    for (const updateTask of updateTodoDto.tasks) {
      if (updateTask.taskIndex >= existingTodo.tasks.length) {
        throw new BadRequestException(
          `The given task index doesn't exist in the todo tasks list!`,
        );
      }

      const todoTask = existingTodo.tasks[updateTask.taskIndex];

      if (updateTask.isInTodoState !== undefined) {
        todoTask.status = updateTask.isInTodoState
          ? TaskStatus.TODO
          : TaskStatus.DONE;
      }

      if (updateTask.label) {
        todoTask.label = updateTask.label;
      }
    }
    if (updateTodoDto.title) {
      existingTodo.title = updateTodoDto.title;
    }
    return this.todoRepository.save(existingTodo);
  }

  public async remove(todoId: string): Promise<boolean> {
    return this.todoRepository.remove(todoId);
  }

  public async removeAll(): Promise<boolean> {
    return this.todoRepository.removeAll();
  }
}
