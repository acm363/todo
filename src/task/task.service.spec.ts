import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';

class TaskServiceMock {
  findAll() {
    return [];
  }
  createTask(title: string) {
    return {};
  }
  changeStatusToDone(taskId: string) {
    return {};
  }
  changeStatusToTodo(taskId: string) {
    return {};
  }
  remove(id: string) {
    return {};
  }
  removeAll() {
    return [];
  }
}
describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(async () => {
    const TaskServiceProvider = {
      provide: TaskService,
      useClass: TaskServiceMock,
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, TaskServiceProvider],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  it('should call findAll method', async () => {
    const findAllSpy = jest.spyOn(taskService, 'findAll');
    await taskService.findAll();
    expect(findAllSpy).toHaveBeenCalled();
  });

  it('should call createTask method with expected args', async () => {
    const createTaskSpy = jest.spyOn(taskService, 'createTask');
    const title = '';
    await taskService.createTask(title);
    expect(createTaskSpy).toHaveBeenCalledWith(title);
  });

  it('should call changeStatusToDone method with expected args', async () => {
    const chgStatusTaskSpy = jest.spyOn(taskService, 'changeStatusToDone');
    const taskId = '';
    await taskService.changeStatusToDone(taskId);
    expect(chgStatusTaskSpy).toHaveBeenCalledWith(taskId);
  });

  it('should call changeStatusToTodo method with expected args', async () => {
    const chgStatusTaskSpy = jest.spyOn(taskService, 'changeStatusToTodo');
    const taskId = '';
    await taskService.changeStatusToTodo(taskId);
    expect(chgStatusTaskSpy).toHaveBeenCalledWith(taskId);
  });

  it('should call remove method with expected args', async () => {
    const removeTaskSpy = jest.spyOn(taskService, 'remove');
    const taskId = '';
    await taskService.remove(taskId);
    expect(removeTaskSpy).toHaveBeenCalledWith(taskId);
  });

  it('should call removeAll method', async () => {
    const removeAllTasksSpy = jest.spyOn(taskService, 'removeAll');
    await taskService.removeAll();
    expect(removeAllTasksSpy).toHaveBeenCalled();
  });
});
