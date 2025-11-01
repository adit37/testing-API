import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage/storage.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private storageService: StorageService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('records')
  async getAllRecords() {
    return await this.appService.getAllRecords();
  }

  @Get('records/:id')
  async getRecordsByDeviceId(@Param('id') id: string) {
    return await this.appService.getRecordsByDeviceId(id);
  }

  @Post('records')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
        fileSize: 1024 * 1024,
      },
    }),
  )
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body('device_id') device_id: string,
    @Body('result') result: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
      throw new BadRequestException(
        'Only PNG, JPG, and JPEG files are allowed',
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds limit of 5MB');
    }

    const uniqueSuffix = Math.round(Math.random() * 1e9);
    const ext = file.originalname;
    const filename = `${device_id}-${uniqueSuffix}${ext}`;

    const image = await this.storageService.save(
      'media/' + filename,
      file.mimetype,
      file.buffer,
      [{ filename: filename }],
    );

    const data = {
      device_id: device_id,
      result: result,
      image_url: image,
    };
    return await this.appService.createRecord(data);
  }
}
