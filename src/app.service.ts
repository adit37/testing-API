import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }
  
  async getAllRecords() {
    try {
      const data = await this.prisma.records.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
  
      return {
        message: 'Successfully fetched records',
        data: data,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Failed to fetch records',
        error: error,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
  
  async getRecordsByDeviceId(id: string) {
    try {
      const data = await this.prisma.records.findMany({
        where: {
          device_id: id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
  
      return {
        message: 'Successfully Get Data By Device Id',
        data: data,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Failed To Get Data By Device Id',
        error: error,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async createRecord(data: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const createData = await this.prisma.records.create({
        data: {
          device_id: data.device_id,
          result: data.result,
          image_url: data.image_url,
        },
      });

      return {
        message: 'Successfully Create History Record',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        message: 'Failed To Create History Record',
        error: error,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
  
    async deleteRecordsByDeviceId(deviceId: string) {
    try {
      const records = await this.prisma.records.findMany({
        where: {
          device_id: deviceId,
        },
      });
  
      // Hapus file di GCP
      for (const record of records) {
        if (record.image_url) {
          const path = record.image_url.split('.com/')[1];
          await this.storageService.delete(path);
        }
      }
  
      await this.prisma.records.deleteMany({
        where: {
          device_id: deviceId,
        },
      });
  
      return {
        message: 'Successfully deleted records & files',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Failed to delete records',
        error: error,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
