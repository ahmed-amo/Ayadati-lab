import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { TenantsService } from './tenants.service';

@ApiTags('tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new laboratory (SaaS onboarding)' })
  register(@Body() dto: RegisterTenantDto) {
    return this.tenantsService.register(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List active laboratories (platform directory)' })
  list() {
    return this.tenantsService.listActiveTenants();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Public lab profile by slug' })
  getBySlug(@Param('slug') slug: string) {
    return this.tenantsService.getPublicProfile(slug);
  }
}
