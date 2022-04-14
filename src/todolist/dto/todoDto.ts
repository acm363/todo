import {IsBoolean, IsNumber, IsOptional, IsString, Min, ValidateNested} from 'class-validator';
import { TaskStatus } from '../entities/todo.entity';
import {Type} from "class-transformer";

export class CreateTodoDto {
  @IsString()
  readonly title: string;
  @IsString({ each: true })
  readonly tasks: string[];
}

export class UpdateTaskDto {
  @IsNumber()
  @Min(0)
  readonly taskIndex: number;
  @IsBoolean()
  @IsOptional()
  readonly isInTodoState: boolean;
  @IsString()
  @IsOptional()
  readonly label: string;
}

export class UpdateTodoDto {
  @IsString()
  readonly title: string;
  @IsOptional()
  @ValidateNested({each: true})
  @Type(() => UpdateTaskDto)
  readonly tasks: UpdateTaskDto[];
}

export class ViewableTodoDto {
  readonly title: string;
  readonly tasks: TodoTaskDto[];
  readonly createdAt: string;
}

export class TodoTaskDto {
  readonly label: string;
  readonly status: TaskStatus;
}
