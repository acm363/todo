import { IsString } from 'class-validator';

export class UpdateTodoIdTaskIdDto {
  @IsString()
  readonly todoId: string;

  @IsString()
  readonly taskId: string;
}
