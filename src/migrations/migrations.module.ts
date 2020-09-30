import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MigrationsService } from './migrations.service';
import { Migration } from 'src/migrations/migration.entity';
import { MigrationFileRepository } from './migration-file.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Migration])],
  providers: [MigrationsService, MigrationFileRepository],
  exports: [MigrationsService]
})
export class MigrationsModule {}
