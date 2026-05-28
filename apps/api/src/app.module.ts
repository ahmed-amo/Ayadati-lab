import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { TenantModule } from './common/tenant/tenant.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { GuestBookingsModule } from './modules/guest-bookings/guest-bookings.module';
import { LabServicesModule } from './modules/lab-services/lab-services.module';
import { AuthModule } from './modules/auth/auth.module';
import { StaffModule } from './modules/staff/staff.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    TenantModule,
    PrismaModule,
    HealthModule,
    TenantsModule,
    AuthModule,
    StaffModule,
    GuestBookingsModule,
    LabServicesModule,
  ],
})
export class AppModule {}
