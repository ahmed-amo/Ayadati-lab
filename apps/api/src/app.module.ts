import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { AuthModule } from './common/auth/auth.module';
import { TenantModule } from './common/tenant/tenant.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { GuestBookingsModule } from './modules/guest-bookings/guest-bookings.module';
import { LabServicesModule } from './modules/lab-services/lab-services.module';
import { AuthModule as LoginModule } from './modules/auth/auth.module';
import { StaffModule } from './modules/staff/staff.module';
import { MedicinesModule } from './modules/medicines/medicines.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    AuthModule,
    TenantModule,
    PrismaModule,
    HealthModule,
    TenantsModule,
    LoginModule,
    StaffModule,
    GuestBookingsModule,
    LabServicesModule,
    MedicinesModule,
    PrescriptionsModule,
    UploadsModule,
  ],
})
export class AppModule {}
