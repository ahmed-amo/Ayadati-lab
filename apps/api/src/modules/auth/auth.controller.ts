import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginUseCase } from './use-cases/login.use-case';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @ApiOperation({ summary: 'Staff / patient login' })
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}
