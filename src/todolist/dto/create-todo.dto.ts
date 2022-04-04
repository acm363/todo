import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({
    description:
      'the id of the todo resource in the application(not real in database)',
    required: true,
    minimum: 1,
  })
  @IsNumber()
  readonly todoId: number;

  @ApiProperty({
    description: 'The title of the todo resource',
    required: true,
    minLength: 1,
  })
  @IsString()
  readonly title: string;

  @ApiProperty({ description: 'The task of the todo resource', required: true })
  @IsString({ each: true })
  readonly tasks: string[];
  // la date est créée automatiquement
}
