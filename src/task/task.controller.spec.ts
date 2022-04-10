import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let taskController: TaskController;
  let spyTaskService: TaskService;

  beforeEach(async () => {
    const TaskServiceProvider = {
      provide: TaskService,
      useFactory: () => ({
        findAll: jest.fn(() => []),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        createTask: jest.fn(() => {}),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        changeStatusToDone: jest.fn(() => {}),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        changeStatusToTodo: jest.fn(() => {}),
        removeAll: jest.fn(() => []),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService, TaskServiceProvider],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    spyTaskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });

  it('should call findAll method', () => {
    const findAllSpy = jest.spyOn(spyTaskService, 'findAll');
    taskController.findAll();
    expect(findAllSpy).toHaveBeenCalled();
  });

  it('should call deleteAll method', () => {
    const removeAllSpy = jest.spyOn(spyTaskService, 'removeAll');
    taskController.deleteAll();
    expect(removeAllSpy).toHaveBeenCalled();
  });
});
