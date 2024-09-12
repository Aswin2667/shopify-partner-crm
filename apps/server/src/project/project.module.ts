import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { PrismaService,DataSourceModule } from '@org/data-source';
import { ProjectService } from './project.service';
@Module({
  imports: [DataSourceModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
