import { Body, Controller, Delete, Get, Header, Logger, Param, Patch, Post } from '@nestjs/common';
import { TodoListService } from './todo-list.service';
import { CreateTodoDto, TodoTaskDto, UpdateTaskDto, UpdateTodoDto, ViewableTodoDto } from './dto/todoDto';
import { Todo } from './entities/todo.entity';

@Controller('todolist')
export class TodoListController {
  private readonly logger = new Logger(TodoListController.name);

  constructor(private readonly todoListService: TodoListService) {}

  @Get()
  @Header('Returned-At', new Date().toLocaleString())
  public async findAll(): Promise<ViewableTodoDto[]> {
    this.logger.debug(`Get all todo resources`);
    const todos = await this.todoListService.findAll();
    return todos.map((todo) => {
      return this.toViewableTodoDto(todo);
    });
  }

  @Get(':id')
  @Header('Returned-At', new Date().toLocaleString())
  public async findOne(@Param('id') todoId: string): Promise<ViewableTodoDto> {
    this.logger.debug(`Get the todo of id ${todoId}!`);
    const todo = await this.todoListService.findOne(todoId);
    return this.toViewableTodoDto(todo);
  }

  @Post()
  @Header('Returned-At', new Date().toLocaleString())
  public async create(@Body() createTodoDto: CreateTodoDto): Promise<ViewableTodoDto> {
    this.logger.debug(`Create a todo -- ${JSON.stringify(createTodoDto)}`);
    const todo = await this.todoListService.create(createTodoDto);
    return this.toViewableTodoDto(todo);
  }

  // Merge all update methods.
  @Patch(':todoId')
  @Header('Returned-At', new Date().toLocaleString())
  public async updateTodo(@Param('todoId') todoId: string, @Body() updateTodoDto: UpdateTodoDto): Promise<ViewableTodoDto> {
    this.logger.debug(`Update the todo of todoId #${todoId}`);
    const todo = await this.todoListService.updateTodo(todoId, updateTodoDto);
    return this.toViewableTodoDto(todo);
  }

  // @Patch('updateTask/:todoId')
  // @Header('Returned-At', new Date().toLocaleString())
  // public async updateTaskState(@Param('todoId') todoId: string, @Body() updateTaskDto: UpdateTaskDto): Promise<ViewableTodoDto> {
  //   this.logger.debug(`Update the task ${updateTaskDto.taskIndex + 1} state in the todo ${todoId}`);
  //   const todo = await this.todoListService.updateTaskState(todoId, updateTaskDto);
  //   return this.toViewableTodoDto(todo);
  // }

  @Delete(':todoId')
  @Header('Returned-At', new Date().toLocaleString())
  public async removeOneTodo(@Param('todoId') todoId: string): Promise<boolean> {
    this.logger.debug(`Delete the todo of id #${todoId}`);
    return this.todoListService.remove(todoId);
  }

  @Delete()
  @Header('Returned-At', new Date().toLocaleString())
  public async removeAll(): Promise<boolean> {
    this.logger.debug(`Delete all the todo in the database`);
    return await this.todoListService.removeAll();
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
