import { IsIn, ValidateIf } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  title: string;

  @ValidateIf((elt) => typeof elt.status !== 'undefined')
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;
}
