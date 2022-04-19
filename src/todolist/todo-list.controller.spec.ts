import { Test, TestingModule } from '@nestjs/testing';
import { TodoListController } from './todo-list.controller';
import { createMock, DeepMocked } from '@golevelup/nestjs-testing';
import { TodoListService } from './todo-list.service';
import { TaskStatus, Todo } from './entities/todo.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateTaskDto, UpdateTodoDto, ViewableTodoDto } from './dto/todoDto';

describe('TodolistController', () => {
  let controller: TodoListController;
  let todoListServiceMock: DeepMocked<TodoListService>;

  beforeEach(async () => {
    todoListServiceMock = createMock<TodoListService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoListController],
      providers: [
        {
          provide: TodoListService,
          useValue: todoListServiceMock,
        },
      ],
    }).compile();

    controller = module.get<TodoListController>(TodoListController);
  });

  it('should call the findAll method of the service.', async () => {
    // Given.
    const date = new Date();
    todoListServiceMock.findAll.mockResolvedValue([
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
    ]);

    // When.
    const results = await controller.findAll();

    // Then.
    expect(results).toHaveLength(1);
    expect(results).toStrictEqual([
      {
        title: 'TODO 1',
        tasks: [
          {
            label: 'task1',
            status: TaskStatus.DONE,
          },
        ],
        createdAt: date.toLocaleString(),
      },
    ]); // Compare the objects values, not the reference.
  });

  it('should call the findOne method of the service and return properly the TODO.', async () => {
    // Given.
    const date = new Date();
    const existingTodoId = '04b547e3';
    todoListServiceMock.findOne.mockResolvedValue({
      todoId: existingTodoId,
      title: 'TODO 1',
      tasks: [
        {
          label: 'task1',
          status: TaskStatus.DONE,
        },
      ],
      createdAt: date,
    });

    // When.
    const result = await controller.findOne(existingTodoId);

    // Then.
    expect(todoListServiceMock.findOne).toBeCalledWith(existingTodoId);
    expect(result).toStrictEqual({
      title: 'TODO 1',
      tasks: [
        {
          label: 'task1',
          status: TaskStatus.DONE,
        },
      ],
      createdAt: date.toLocaleString(),
    } as ViewableTodoDto);
  });

  it('should call the create a TODO and return it properly formatted.', async () => {
    // Given.
    const date = new Date();
    const todoDto = {
      title: 'TODO 1',
      tasks: ['task1'],
    };

    todoListServiceMock.create.mockResolvedValue({
      todoId: '455',
      title: 'TODO 1',
      tasks: [
        {
          label: 'task1',
          status: TaskStatus.DONE,
        },
      ],
      createdAt: date,
    });

    // When.
    const result = await controller.create(todoDto);

    // Then.
    expect(todoListServiceMock.create).toBeCalledWith(todoDto);
    expect(result).toStrictEqual({
      title: 'TODO 1',
      tasks: [
        {
          label: 'task1',
          status: TaskStatus.DONE,
        },
      ],
      createdAt: date.toLocaleString(),
    } as ViewableTodoDto);
  });

  it('should remove the TODO and return the corresponding result.', async () => {
    // Given.
    const existingTodoId = '566';
    const nonExistingTodoId = '445';
    todoListServiceMock.remove
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    // When.
    const existingResult = await controller.removeOneTodo(existingTodoId);
    const nonExistingResult = await controller.removeOneTodo(nonExistingTodoId);

    // Then.
    expect(todoListServiceMock.remove).nthCalledWith(1, existingTodoId);
    expect(todoListServiceMock.remove).nthCalledWith(2, nonExistingTodoId);

    expect(existingResult).toBe(true);
    expect(nonExistingResult).toBe(false);
  });

  it('should remove all the TODO and return the corresponding result.', async () => {
    // Given.
    todoListServiceMock.removeAll
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    // When.
    const existingResult = await controller.removeAll();
    const nonExistingResult = await controller.removeAll();

    // Then.
    expect(existingResult).toBe(true);
    expect(nonExistingResult).toBe(false);
  });

  it('should update the TODO with the new values', async () => {
    // Given.
    const date = new Date();
    const existingTodoId = '45sd545';
    const updateTodoDto = {
      title: 'new title',
      tasks: [
        {
          taskIndex: 0,
          isInTodoState: false,
          label: 'new task',
        },
      ],
    } as UpdateTodoDto;

    todoListServiceMock.updateTodo.mockResolvedValue({
      todoId: existingTodoId,
      title: 'new title',
      tasks: [
        {
          label: 'new label',
          status: TaskStatus.DONE,
        },
      ],
      createdAt: date,
    } as Todo);

    // When.
    const updatedResult = await controller.updateTodo(
      existingTodoId,
      updateTodoDto,
    );

    // Then.
    expect(todoListServiceMock.updateTodo).toBeCalledWith(
      existingTodoId,
      updateTodoDto,
    );
    expect(updatedResult).toStrictEqual({
      title: 'new title',
      tasks: [
        {
          label: 'new label',
          status: TaskStatus.DONE,
        },
      ],
      createdAt: date.toLocaleString(),
    } as ViewableTodoDto);
  });

  it('should throw error when non existing todoId is given for findOne method.', async () => {
    // Given.
    const nonExistingTodoId = 'd4584qs';
    todoListServiceMock.findOne.mockRejectedValue(
      new NotFoundException(
        `Todo with todoId #${nonExistingTodoId} not found in the database!`,
      ),
    );

    // When.
    const rejectedPromise = controller.findOne(nonExistingTodoId);

    // Then.
    await expect(rejectedPromise).rejects.toThrow(NotFoundException);
  });

  it('should throw error when updating non existing todo', async () => {
    // Given.
    const nonExistingTodoId = 'd4584qs';
    todoListServiceMock.updateTodo.mockRejectedValue(
      new NotFoundException(
        `Todo with todoId #${nonExistingTodoId} not found in the database!`,
      ),
    );

    // When.
    const rejectedPromise = controller.updateTodo(nonExistingTodoId, undefined);

    // Then.
    await expect(rejectedPromise).rejects.toThrow(NotFoundException);
  });
});
