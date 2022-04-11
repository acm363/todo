import { IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  readonly title: string;
  @IsString({ each: true })
  readonly tasks: string[];
}


export class UpdateTodoDto{
    @IsString()
    readonly title: String;
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