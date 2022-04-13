import {Test, TestingModule} from '@nestjs/testing';
import {TodoListController} from './todo-list.controller';
import {createMock, DeepMocked} from '@golevelup/nestjs-testing';
import {TodoListService} from './todo-list.service';
import {TaskStatus} from './entities/todo.entity';

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

    it('should be defined.', () => {
        expect(controller).toBeDefined();
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
        });
    });

    it('should remove the TODO and return the corresponding result', async () => {
        // Given.
        const existingTodoId = '566';
        const nonExistingTodoId = '445';
        todoListServiceMock.remove.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

        // When.
        const existingResult = await controller.removeOneTodo(existingTodoId);
        const nonExistingResult = await controller.removeOneTodo(nonExistingTodoId);

        // Then.
        expect(todoListServiceMock.remove).nthCalledWith(1, existingTodoId);
        expect(todoListServiceMock.remove).nthCalledWith(2, nonExistingTodoId);

        expect(existingResult).toBe(true);
        expect(nonExistingResult).toBe(false);
    });
});
