import { TodoListService } from './todo-list.service';
import { TodoListRepository } from './todo-list-repository.service';
import { createMock, DeepMocked } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatus, Todo, TodoTask } from './entities/todo.entity';
import {
  CreateTodoDto,
  TodoTaskDto,
  UpdateTaskDto,
  UpdateTodoDto,
} from './dto/todoDto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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

  it('should create the TODO and return it in the correct format.', async () => {
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
      } as TodoTaskDto,
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
        } as TodoTaskDto,
      ],
    });
    expect(result).toStrictEqual(todo);
  });

  describe('updateTodo method', () => {
    let date: Date;
    let todoId: string;
    let existingTodo: Todo;

    beforeEach(() => {
      date = new Date();
      todoId = '45qss44';
      existingTodo = {
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
      };
      todoListRepositoryMock.findOne.mockResolvedValue(existingTodo);
      todoListRepositoryMock.save.mockResolvedValue(existingTodo);
    });

    it('should update the corresponding todo with the given values.', async () => {
      // Given.
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
      };

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

    it('should update the task state when only the isInTodoState is given in the update task dto.', async () => {
      // Given.
      const updateTodoDto = {
        tasks: [
          {
            taskIndex: 0,
            isInTodoState: false,
          } as UpdateTaskDto,
        ],
      } as UpdateTodoDto;

      // When.
      const result = await todoListService.updateTodo(todoId, updateTodoDto);

      // Then.
      expect(todoListRepositoryMock.findOne).toBeCalledWith(todoId);
      expect(result).toMatchObject({
        todoId: todoId,
        createdAt: date,
        title: 'Old Title',
        tasks: [
          {
            label: 'task1',
            status: TaskStatus.DONE,
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
      } as Todo);
    });
    it('should update the todo with the given tasks only', async () => {
      // Given.
      const updateTodoDto = {
        tasks: [
          {
            taskIndex: 1,
            isInTodoState: false,
            label: 'new task 2',
          } as UpdateTaskDto,
        ],
      } as UpdateTodoDto;

      // When.
      const result = await todoListService.updateTodo(todoId, updateTodoDto);

      // Then.
      expect(todoListRepositoryMock.findOne).toBeCalledWith(todoId);
      expect(result).toMatchObject({
        todoId: todoId,
        createdAt: date,
        title: 'Old Title',
        tasks: [
          {
            label: 'task1',
            status: TaskStatus.TODO,
          } as TodoTask,
          {
            label: 'new task 2',
            status: TaskStatus.DONE,
          } as TodoTask,
          {
            label: 'task3',
            status: TaskStatus.DONE,
          } as TodoTask,
        ],
      } as Todo);
    });

    it('should update the todo with the title only.', async () => {
      // Given.
      const updateTodoDto = {
        title: 'New title',
        tasks: [],
      } as UpdateTodoDto;

      // When.
      const result = await todoListService.updateTodo(todoId, updateTodoDto);

      // Then.
      expect(todoListRepositoryMock.findOne).toBeCalledWith(todoId);
      expect(result).toMatchObject({
        todoId: todoId,
        createdAt: date,
        title: 'New title',
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
      } as Todo);
    });

    it('should update the tasks with the label only.', async () => {
      // Given.
      const updateTodoDto = {
        tasks: [
          {
            taskIndex: 0,
            label: 'new task 1',
          } as UpdateTaskDto,
        ],
      } as UpdateTodoDto;

      // When.
      const result = await todoListService.updateTodo(todoId, updateTodoDto);

      // Then.
      expect(todoListRepositoryMock.findOne).toBeCalledWith(todoId);
      expect(result).toMatchObject({
        todoId: todoId,
        createdAt: date,
        title: 'Old Title',
        tasks: [
          {
            label: 'new task 1',
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
      } as Todo);
    });
  });

  it('should remove the TODO if the given todo id exist and return corresponding result.', async () => {
    // Given.
    const existingTodoId = '54584f';
    const nonExistingTodoId = '54ze7f';
    todoListRepositoryMock.remove
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    // When.
    const existingResult = await todoListService.remove(existingTodoId);
    const nonExistingResult = await todoListService.remove(nonExistingTodoId);

    // Then.
    expect(todoListRepositoryMock.remove).nthCalledWith(1, existingTodoId);
    expect(todoListRepositoryMock.remove).nthCalledWith(2, nonExistingTodoId);

    expect(existingResult).toBe(true);
    expect(nonExistingResult).toBe(false);
  });

  it('should remove all the TODO in the database and return the corresponding result.', async () => {
    // Given.
    todoListRepositoryMock.removeAll
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    // When.
    const existingResult = await todoListService.removeAll();
    const nonExistingResult = await todoListService.removeAll();

    // Then.
    expect(existingResult).toBe(true);
    expect(nonExistingResult).toBe(false);
  });

  it('should throw an error when find a non existing TODO.', async () => {
    // Given.
    const nonExistingTodoId = '454';
    todoListRepositoryMock.findOne.mockRejectedValue(
      new NotFoundException(
        `Todo with todoId #${nonExistingTodoId} not found in the database!`,
      ),
    );

    // When.
    const rejectedPromise = todoListService.findOne(nonExistingTodoId);

    // Then.
    await expect(rejectedPromise).rejects.toThrow(NotFoundException);
  });

  it('should throw error when updating non existing TodoId.', async () => {
    // When.
    const nonExistingTodoId = '444dss';
    todoListRepositoryMock.findOne.mockRejectedValue(
      new NotFoundException(
        `Todo with todoId #${nonExistingTodoId} not found in the database!`,
      ),
    );
    // Given.
    const rejectedPromise = todoListService.updateTodo(
      nonExistingTodoId,
      undefined,
    );

    // Then.
    await expect(rejectedPromise).rejects.toThrow(NotFoundException);
  });

  it('should throw error when updating a task with an out of bound taskIndex.', async () => {
    // Given.
    const updateTodoDto = {
      title: 'New TODO',
      tasks: [
        {
          taskIndex: 0,
          isInTodoState: false,
          label: 'new task 1',
        } as UpdateTaskDto,
        {
          taskIndex: 2, // This task Index doesn't exist in the database.
          isInTodoState: true,
          label: 'non existing task',
        } as UpdateTaskDto,
      ],
    } as UpdateTodoDto;

    const date = new Date();
    const todoId = '45sq';

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
          status: TaskStatus.DONE,
        } as TodoTask,
      ],
    } as Todo;
    todoListRepositoryMock.findOne.mockResolvedValue(existingTodo);

    // When.
    const rejectedPromise = todoListService.updateTodo(todoId, updateTodoDto);

    // Then.
    expect(todoListRepositoryMock.findOne).toBeCalledWith(todoId);
    await expect(rejectedPromise).rejects.toThrow(BadRequestException);
  });
});
