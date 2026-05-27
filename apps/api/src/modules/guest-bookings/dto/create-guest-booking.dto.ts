import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateGuestBookingDto {
  @ApiProperty({ example: 'Ahmed Benali' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  fullName!: string;

  @ApiProperty({ example: '0555123456' })
  @IsString()
  @Matches(/^0[5-7][0-9]{8}$/, {
    message: 'Phone must be a valid Algerian mobile number (05/06/07 + 8 digits)',
  })
  phone!: string;

  @ApiPropertyOptional({ example: 'patient@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '1234567890123456' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  nationalId?: string;

  @ApiProperty({ example: '2026-06-15' })
  @IsDateString()
  appointmentDate!: string;

  @ApiProperty({ example: '09:30', description: 'Preferred time (HH:mm)' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'preferredTime must be HH:mm (24h)',
  })
  preferredTime!: string;

  @ApiProperty({ example: 'cbc', description: 'Lab service slug' })
  @IsString()
  @IsNotEmpty()
  testType!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
