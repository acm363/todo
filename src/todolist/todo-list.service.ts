import { Injectable, Logger } from '@nestjs/common';
import { TaskStatus, Todo, TodoTask } from './entities/todo.entity';
import { TodoListRepository } from './todo-list-repository.service';
import { CreateTodoDto, UpdateTodoDto } from './dto/todoDto';
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

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
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

  // public async updateTodo(publicId: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
  //   return this.todoRepository.updateTodo(publicId, updateTodoDto);
  // }

  public async remove(publicId: string): Promise<UpdateTodoDto> {
    return this.todoRepository.remove(publicId);
  }
}
