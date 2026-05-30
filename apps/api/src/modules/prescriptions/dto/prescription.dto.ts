import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PrescriptionGender, PrescriptionStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class PrescriptionItemDto {
  @ApiProperty()
  @IsInt()
  medicineId!: number;

  @ApiProperty({ example: '1 tablet after meals' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  dosage!: string;

  @ApiProperty({ example: '2x/day' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  frequency!: string;

  @ApiProperty({ example: '5 days' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  duration!: string;
}

export class HeaderThemeDto {
  @ApiPropertyOptional({ enum: ['classic', 'minimal', 'bordered'] })
  @IsOptional()
  @IsString()
  layout?: string;

  @ApiPropertyOptional({ example: '#1e3a5f' })
  @IsOptional()
  @IsString()
  accentColor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  showSeparator?: boolean;
}

export class CreatePrescriptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  patientName!: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(150)
  age!: number;

  @ApiProperty({ enum: PrescriptionGender })
  @IsEnum(PrescriptionGender)
  gender!: PrescriptionGender;

  @ApiProperty({ example: '2026-05-30' })
  @IsDateString()
  date!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  clinicNameSnapshot!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  signatureUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  headerTheme?: HeaderThemeDto;

  @ApiProperty({ enum: PrescriptionStatus, default: PrescriptionStatus.DRAFT })
  @IsOptional()
  @IsEnum(PrescriptionStatus)
  status?: PrescriptionStatus;

  @ApiProperty({ type: [PrescriptionItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items!: PrescriptionItemDto[];
}

export class UpdatePrescriptionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  patientName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  age?: number;

  @ApiPropertyOptional({ enum: PrescriptionGender })
  @IsOptional()
  @IsEnum(PrescriptionGender)
  gender?: PrescriptionGender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  clinicNameSnapshot?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logoUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  signatureUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  headerTheme?: HeaderThemeDto | null;

  @ApiPropertyOptional({ enum: PrescriptionStatus })
  @IsOptional()
  @IsEnum(PrescriptionStatus)
  status?: PrescriptionStatus;

  @ApiPropertyOptional({ type: [PrescriptionItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items?: PrescriptionItemDto[];
}

export class PatientSearchQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
