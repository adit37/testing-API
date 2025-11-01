import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { StorageService } from './storage/storage.service';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, StorageService],
})
export class AppModule {}
