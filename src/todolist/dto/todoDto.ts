import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { TaskStatus } from '../entities/todo.entity';
import { Type } from 'class-transformer';

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
  @IsOptional()
  readonly title: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTaskDto)
  readonly tasks: UpdateTaskDto[]; // Tasks isn't optional to avoid another verification in todoList service when it's not given in the DTO.
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
