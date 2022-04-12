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
  public async findOne(@Param('id') publicId: string): Promise<ViewableTodoDto> {
    this.logger.debug(`Get the todo of id ${publicId}!`);
    const todo = await this.todoListService.findOne(publicId);
    this.logger.log(todo);
    if (todo) return this.toViewableTodoDto(todo);
  }

  @Post()
  @Header('Returned-At', new Date().toLocaleString())
  public async create(@Body() createTodoDto: CreateTodoDto): Promise<ViewableTodoDto> {
    this.logger.debug(`Create a todo -- ${JSON.stringify(createTodoDto)}`);
    const todo = await this.todoListService.create(createTodoDto);
    if (todo) return this.toViewableTodoDto(todo);
  }

  @Patch(':publicId')
  @Header('Returned-At', new Date().toLocaleString())
  public async updateTodoTitle(
    @Param('publicId') publicId: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<ViewableTodoDto> {
    this.logger.debug(`Update the todo of publicId #${publicId}`);
    const todo = await this.todoListService.updateTodo(publicId, updateTodoDto);
    if (todo) return this.toViewableTodoDto(todo);
  }

  @Patch('updateTask/:publicId')
  @Header('Returned-At', new Date().toLocaleString())
  public async updateTaskState(
    @Param('publicId') publicId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<ViewableTodoDto> {
    this.logger.debug(`Update the task ${updateTaskDto.taskIndex + 1} state in the todo ${publicId}`);
    const todo = await this.todoListService.updateTaskState(publicId, updateTaskDto);
    if (todo) return this.toViewableTodoDto(todo);
  }

  @Delete(':publicId')
  @Header('Returned-At', new Date().toLocaleString())
  public async removeOneTodo(@Param('publicId') publicId: string): Promise<ViewableTodoDto> {
    this.logger.debug(`Delete the todo of id #${publicId}`);
    const todo = await this.todoListService.remove(publicId);
    if (todo) return this.toViewableTodoDto(todo);
    else this.logger.error(`Nothing can be delete - todo doesn't exist`);
  }

  @Delete()
  @Header('Returned-At', new Date().toLocaleString())
  public async removeAll() {
    this.logger.debug(`Delete all the todo in the database`);
    const todos = await this.todoListService.removeAll();
    return todos;
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
