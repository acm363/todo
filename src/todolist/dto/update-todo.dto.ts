import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateTodoDto {
  @ApiProperty({
    description: 'The title of the todo resource',
    required: true,
    minLength: 1,
  })
  @IsString()
  readonly title: string;
}
