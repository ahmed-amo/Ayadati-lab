import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'receptionist@ayadatilab.dz' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'ayadati2026' })
  @IsString()
  @MinLength(6)
  password!: string;
}
