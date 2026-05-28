import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantInterceptor } from '../../common/tenant/tenant.interceptor';
import { LoginDto } from './dto/login.dto';
import { LoginUseCase } from './use-cases/login.use-case';

@ApiTags('auth')
@Controller('t/:tenantSlug/auth')
@UseInterceptors(TenantInterceptor)
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @ApiOperation({ summary: 'Staff / patient login for a laboratory tenant' })
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}
