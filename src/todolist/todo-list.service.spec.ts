import { TodoListService } from './todo-list.service';
import { TodoListRepository } from './todo-list-repository.service';
import { createMock, DeepMocked } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatus, Todo, TodoTask } from './entities/todo.entity';
import { CreateTodoDto, UpdateTaskDto, UpdateTodoDto } from './dto/todoDto';

describe('TodoListService', () => {
  let todoListService: TodoListService;
  let todoListRepositoryMock: DeepMocked<TodoListRepository>;

  beforeEach(async () => {
    todoListRepositoryMock = createMock<TodoListRepository>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoListService,
        {
          provide: TodoListRepository,
          useValue: todoListRepositoryMock,
        },
      ],
    }).compile();

    todoListService = module.get<TodoListService>(TodoListService);
  });

  it('should call the findAll method of the repository.', async () => {
    // Given.
    const date = new Date();
    todoListRepositoryMock.findAll.mockResolvedValue([
      {
        todoId: '455',
        title: 'TODO 1',
        tasks: [
          {
            label: 'task1',
            status: TaskStatus.DONE,
          },
        ],
        createdAt: date,
      },
    ] as Todo[]);

    // When.
    const results = await todoListService.findAll();

    // Then.
    expect(results).toHaveLength(1);
    expect(results).toStrictEqual([
      {
        todoId: '455',
        title: 'TODO 1',
        tasks: [
          {
            label: 'task1',
            status: TaskStatus.DONE,
          },
        ],
        createdAt: date,
      },
    ] as Todo[]);
  });

  it('should call the findOne method of the repository and return the right TODO.', async () => {
    // Given.
    const date = new Date();
    const existingTodoId = '04b547e3';
    todoListRepositoryMock.findOne.mockResolvedValue({
      todoId: existingTodoId,
      title: 'TODO 1',
      tasks: [
        {
          label: 'task1',
          status: TaskStatus.DONE,
        },
      ],
      createdAt: date,
    } as Todo);

    // When.
    const result = await todoListService.findOne(existingTodoId);

    // Then.
    expect(todoListRepositoryMock.findOne).toBeCalledWith(existingTodoId);
    expect(result).toStrictEqual({
      todoId: existingTodoId,
      title: 'TODO 1',
      tasks: [
        {
          label: 'task1',
          status: TaskStatus.DONE,
        },
      ],
      createdAt: date,
    } as Todo);
  });

  it('should create the TODO and return it in the correct format', async () => {
    // Given.
    const date = new Date();
    const todoId = 'fj484b54';
    const todoDto = {
      title: 'TODO 2',
      tasks: ['task1'],
    } as CreateTodoDto;

    const todo = new Todo();
    todo.todoId = todoId;
    todo.title = 'TODO 2';
    todo.tasks = [
      {
        label: 'task1',
        status: TaskStatus.TODO,
      },
    ];
    todo.createdAt = date;

    todoListRepositoryMock.create.mockResolvedValue(todo);

    // When.
    const result = await todoListService.create(todoDto);

    // Then.
    expect(todoListRepositoryMock.create).toBeCalled();
    expect(todoListRepositoryMock.create.mock.calls[0][0]).toMatchObject({
      title: todo.title,
      tasks: [
        {
          label: 'task1',
          status: TaskStatus.TODO,
        },
      ],
    });
    expect(result).toStrictEqual(todo);
  });

  it('should update the corresponding todo with the given values', async () => {
    // Given.
    const date = new Date();
    const todoId = '45sq';
    const updateTodoDto = {
      title: 'New Title',
      tasks: [
        {
          taskIndex: 0,
          isInTodoState: false,
          label: 'new task 1',
        } as UpdateTaskDto,
        {
          taskIndex: 2,
          isInTodoState: true,
          label: 'new task 3',
        } as UpdateTaskDto,
      ],
    } as UpdateTodoDto;

    const existingTodo = {
      todoId: todoId,
      createdAt: date,
      title: 'Old Title',
      tasks: [
        {
          label: 'task1',
          status: TaskStatus.TODO,
        } as TodoTask,
        {
          label: 'task2',
          status: TaskStatus.TODO,
        } as TodoTask,
        {
          label: 'task3',
          status: TaskStatus.DONE,
        } as TodoTask,
      ],
    } as Todo;

    todoListRepositoryMock.findOne.mockResolvedValue(existingTodo);
    todoListRepositoryMock.save.mockResolvedValue(existingTodo);

    // When.
    const result = await todoListService.updateTodo(todoId, updateTodoDto);

    // Then.
    expect(result).toStrictEqual({
      todoId: todoId,
      createdAt: date,
      title: 'New Title',
      tasks: [
        {
          label: 'new task 1',
          status: TaskStatus.DONE,
        } as TodoTask,
        {
          label: 'task2',
          status: TaskStatus.TODO,
        } as TodoTask,
        {
          label: 'new task 3',
          status: TaskStatus.TODO,
        } as TodoTask,
      ],
    } as Todo);
  });
});
