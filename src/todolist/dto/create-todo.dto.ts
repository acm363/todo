import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTodoDto {
  @ApiProperty({
    description: 'The title of the todo resource',
    required: true,
    minLength: 1,
  })
  @IsString()
  readonly title: string;

  @ApiProperty({ description: 'The task of the todo resource', required: true })
  readonly task: string;
  // la date est créée automatiquement
}
