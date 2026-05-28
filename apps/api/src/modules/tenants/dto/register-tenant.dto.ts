import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterTenantDto {
  @ApiProperty({ example: 'Clinique El Amal' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  labName!: string;

  @ApiProperty({ example: 'el-amal-lab', description: 'URL slug: /l/el-amal-lab' })
  @IsString()
  @MinLength(3)
  @MaxLength(48)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase letters, numbers, and hyphens only',
  })
  slug!: string;

  @ApiProperty({ example: 'admin@elamal.dz' })
  @IsEmail()
  adminEmail!: string;

  @ApiProperty({ example: 'Dr. Ahmed Benali' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  adminFullName!: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8)
  adminPassword!: string;

  @ApiPropertyOptional({ example: 'Constantine' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;

  @ApiPropertyOptional({ example: '0555123456' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;
}
