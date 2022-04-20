import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getInMemoryDatabaseModule, shutdownInMemoryDb } from './database-in-memory-handler.utils';
import { TaskStatus, Todo, TodoDocument } from '../src/todolist/entities/todo.entity';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { UpdateTaskDto, UpdateTodoDto, ViewableTodoDto } from '../src/todolist/dto/todoDto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let todoModel: Model<TodoDocument>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [await getInMemoryDatabaseModule(), AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    todoModel = moduleRef.get<Model<TodoDocument>>(getModelToken(Todo.name));
  });

  afterEach(async () => {
    await shutdownInMemoryDb();
    await app.close();
  });

  it('should not accept the request with bad authorization key.', async () => {
    // Given.
    const badKey = 'aBadKey';

    // When.
    const response = await request(app.getHttpServer()).get('/todolist').set('Authorization', badKey);

    // Then.
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it('/GET', async () => {
    // Given.
    const date = new Date();
    const allTodos = [
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
      } as Todo,
      {
        todoId: '456',
        title: 'TODO 2',
        tasks: [
          {
            label: 'task1',
            status: TaskStatus.DONE,
          },
        ],
        createdAt: date,
      } as Todo,
    ];
    await todoModel.create(allTodos);

    // When.
    const response = await request(app.getHttpServer()).get('/todolist').set('Authorization', process.env.API_KEY);

    // Then.
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toStrictEqual([
      {
        title: 'TODO 1',
        tasks: [
          {
            label: 'task1',
            status: TaskStatus.DONE,
          },
        ],
        createdAt: date.toLocaleString(),
      } as ViewableTodoDto,
      {
        title: 'TODO 2',
        tasks: [
          {
            label: 'task1',
            status: TaskStatus.DONE,
          },
        ],
        createdAt: date.toLocaleString(),
      } as ViewableTodoDto,
    ]);
  });

  it('GET/:todoId', async () => {
    // Given.
    const date = new Date();
    const todo = {
      todoId: '455',
      title: 'TODO 1',
      tasks: [
        {
          label: 'task1',
          status: TaskStatus.DONE,
        },
      ],
      createdAt: date,
    } as Todo;
    await todoModel.create(todo);

    // When.
    const response = await request(app.getHttpServer()).get('/todolist/455').set('Authorization', process.env.API_KEY);

    // Then.
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toStrictEqual({
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

  it('/POST', async () => {
    // Given.
    const body = {
      title: 'TODO',
      tasks: ['task1', 'task2'],
    };

    // When.
    const response = await request(app.getHttpServer())
      .post('/todolist')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', process.env.API_KEY);

    // Then.
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toMatchObject({
      title: 'TODO',
      tasks: [
        {
          label: 'task1',
          status: 'Todo',
        },
        {
          label: 'task2',
          status: 'Todo',
        },
      ],
    });
  });

  it('/PATCH/:todoId', async () => {
    // Given.
    const date = new Date();
    const todo = {
      todoId: '455',
      title: 'TODO 1',
      tasks: [
        {
          label: 'task1',
          status: TaskStatus.TODO,
        },
      ],
      createdAt: date,
    } as Todo;
    const body = {
      title: 'new title',
      tasks: [
        {
          taskIndex: 0,
          isInTodoState: false,
          label: 'new task 1',
        } as UpdateTaskDto,
      ],
    } as UpdateTodoDto;
    await todoModel.create(todo);
    // When.
    const response = await request(app.getHttpServer())
      .patch('/todolist/455')
      .send(body)
      .set('Accept', 'application/json')
      .set('Authorization', process.env.API_KEY);

    // Then.
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toStrictEqual({
      title: 'new title',
      tasks: [
        {
          label: 'new task 1',
          status: TaskStatus.DONE,
        },
      ],
      createdAt: date.toLocaleString(),
    } as ViewableTodoDto);
  });

  it('DELETE/', async () => {
    // Given.
    const date = new Date();
    const allTodos = [
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
      } as Todo,
      {
        todoId: '456',
        title: 'TODO 2',
        tasks: [
          {
            label: 'task1',
            status: TaskStatus.DONE,
          },
        ],
        createdAt: date,
      } as Todo,
    ];
    await todoModel.create(allTodos);

    // When.
    const response = await request(app.getHttpServer()).del('/todolist/').set('Authorization', process.env.API_KEY);
    const todos = await todoModel.find();

    // Then.
    expect(response.status).toBe(HttpStatus.OK);
    expect(todos).toHaveLength(0);
    expect(todos).toStrictEqual([]);
  });

  it('DELETE/todoId', async () => {
    // Given.
    const date = new Date();
    const allTodos = [
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
      } as Todo,
      {
        todoId: '456',
        title: 'TODO 2',
        tasks: [
          {
            label: 'task1',
            status: TaskStatus.DONE,
          },
        ],
        createdAt: date,
      } as Todo,
    ];
    await todoModel.create(allTodos);

    // When.
    const response = await request(app.getHttpServer()).del('/todolist/455').set('Authorization', process.env.API_KEY);
    const todos = await todoModel.find();

    // Then.
    expect(response.status).toBe(HttpStatus.OK);
    expect(todos).toHaveLength(1);
    expect(todos).toMatchObject([
      {
        title: 'TODO 2',
        tasks: [
          {
            label: 'task1',
            status: 'Done',
          },
        ],
        createdAt: date,
      },
    ]);
  });
});
