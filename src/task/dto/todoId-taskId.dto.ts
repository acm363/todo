import { IsString } from 'class-validator';

export class UpdateTodoIdTaskId {
  @IsString()
  readonly todoId: string;

  @IsString()
  readonly taskId: string;
}
