import { IsString } from 'class-validator';

export class UpdateStateTaskDto {
  @IsString()
  readonly todoId: string;

  @IsString()
  readonly taskId: string;
}
