import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import { TaskStatus, Todo, TodoTask } from './entities/todo.entity';
import { TodoListRepository } from './todo-list-repository.service';
import { CreateTodoDto, UpdateTaskDto, UpdateTodoDto } from './dto/todoDto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TodoListService {
  private readonly logger = new Logger(TodoListService.name);

  constructor(private readonly todoRepository: TodoListRepository) {}

  public async findAll(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  public async findOne(publicId: string): Promise<Todo> {
    return this.todoRepository.findOne(publicId);
  }

  public async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = new Todo();
    todo.publicId = uuidv4();
    todo.title = createTodoDto.title;
    todo.createdAt = new Date();
    todo.tasks = createTodoDto.tasks.map((task) => {
      return {
        label: task,
        status: TaskStatus.TODO, // By default, we want all new task to be in this state.
      } as TodoTask;
    });

    return this.todoRepository.create(todo);
  }

  public async updateTodo(publicId: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    let existingTodo = await this.todoRepository.findOne(publicId);
    if (!existingTodo) {
      throw new NotFoundException(`Todo with publicId #${publicId} not found in the database!`);
    }
    existingTodo.title = updateTodoDto.title;
    return this.todoRepository.save(existingTodo);
  }

  public async updateTaskState(publicId: string, updateTaskDto: UpdateTaskDto): Promise<Todo> {
    const existingTodo = await this.todoRepository.findOne(publicId);
    if (!existingTodo) {
      throw new NotFoundException(`Todo with publicId #${publicId} not found in the database!`);
    }
    existingTodo.tasks[updateTaskDto.taskIndex].status = updateTaskDto.todoBool ? TaskStatus.TODO : TaskStatus.DONE;
    return this.todoRepository.save(existingTodo);
  }

  public async remove(publicId: string): Promise<Todo> {
    return this.todoRepository.remove(publicId);
  }

  public async removeAll() {
    return this.todoRepository.removeAll();
  }
}
