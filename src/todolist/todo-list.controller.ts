import { Body, Controller, Delete, Get, Header, Logger, Param, Patch, Post } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { CreateTodoDto, TodoTaskDto, UpdateTodoDto, ViewableTodoDto } from './dto/todoDto';
import { Todo } from './entities/todo.entity';

@Controller('todolist')
export class TodoListController {
  private readonly logger = new Logger(TodoListController.name);

  constructor(private readonly todoListService: TodoListService) {}

  @Get()
  @Header('Returned-At', new Date().toLocaleString())
  public async findAll(): Promise<ViewableTodoDto[]> {
    this.logger.debug(`Find all todo resources`);
    const todos = await this.todoListService.findAll();
    return todos.map((todo) => {
      return this.toViewableTodoDto(todo);
    });
  }

  @Get(':id')
  @Header('Returned-At', new Date().toLocaleString())
  public async findOne(@Param('id') publicId: string): Promise<ViewableTodoDto> {
    this.logger.debug(`Find the todo of id ${publicId}!`);
    const todo = await this.todoListService.findOne(publicId);
    return this.toViewableTodoDto(todo);
  }

  @Post()
  @Header('Returned-At', new Date().toLocaleString())
  public async create(@Body() createTodoDto: CreateTodoDto): Promise<ViewableTodoDto> {
    this.logger.debug(`Creating a todo -- ${JSON.stringify(createTodoDto)}`);
    const todo = await this.todoListService.create(createTodoDto);
    return this.toViewableTodoDto(todo);
  }

  // @Patch(':id')
  // @Header('Returned-At', new Date().toLocaleString())
  // public async updateTodoTitle(@Param(':id') publicId: string, @Body() updateTodoDto: UpdateTodoDto): Promise<ViewableTodoDto> {
  //   this.logger.debug(`Updating the todo of id #${publicId}`);
  //   const todo = await this.todoListService.updateTodo(publicId, updateTodoDto);
  //   return this.toViewableTodoDto(todo);
  // }

  @Delete(':id')
  @Header('Returned-At', new Date().toLocaleString())
  removeTodo(@Param('id') id: string) {
    this.logger.debug(`Suppression de la TODO  #${id}`);
    return this.todoListService.remove(id);
  }

  private toViewableTodoDto(todo: Todo): ViewableTodoDto {
    return {
      title: todo.title,
      tasks: todo.tasks.map((task) => {
        return {
          label: task.label,
          status: task.status,
        } as TodoTaskDto;
      }),
      createdAt: todo.createdAt.toLocaleString(),
    } as ViewableTodoDto;
  }
}
