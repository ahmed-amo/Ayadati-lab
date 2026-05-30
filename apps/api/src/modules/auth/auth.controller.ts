import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/auth/public.decorator';
import { TenantInterceptor } from '../../common/tenant/tenant.interceptor';
import { LoginDto } from './dto/login.dto';
import { LoginUseCase } from './use-cases/login.use-case';

@ApiTags('auth')
@Controller('t/:tenantSlug/auth')
@UseInterceptors(TenantInterceptor)
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Staff / patient login for a laboratory tenant' })
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}
