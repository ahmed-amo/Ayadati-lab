import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LabServicesService {
  constructor(private readonly prisma: PrismaService) {}

  findActive() {
    return this.prisma.labService.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        slug: true,
        nameFr: true,
        nameAr: true,
        nameEn: true,
        description: true,
      },
    });
  }
}
