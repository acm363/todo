import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  readonly title: string;
  @IsString({ each: true })
  readonly tasks: string[];
}

let isNumber = IsNumber;

export class UpdateTaskDto {
  @IsNumber()
  readonly taskIndex: number;
  @IsBoolean()
  readonly todoBool: boolean;
}


export class UpdateTodoDto {
  @IsString()
  readonly title: string;
}

export class ViewableTodoDto {
  readonly title: string;
  readonly tasks: TodoTaskDto[];
  readonly createdAt: string;
}

export class TodoTaskDto {
  readonly label: string;
  readonly status: string;
}
