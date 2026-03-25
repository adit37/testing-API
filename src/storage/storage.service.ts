// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DownloadResponse, Storage } from '@google-cloud/storage';
import { HttpStatus, Injectable } from '@nestjs/common';
import StorageConfig from './storage-config';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.storage = new Storage({
      projectId: StorageConfig.projectId,
      credentials: {
        client_email: StorageConfig.client_email,
        private_key: StorageConfig.private_key,
      },
    });

    this.bucket = StorageConfig.mediaBucket;
  }

  async save(
    path: string,
    contentType: string,
    media: Buffer,
    metadata: { [key: string]: string }[],
  ) {
    try {
      const object = metadata.reduce(
        (obj, item) => Object.assign(obj, item),
        {},
      );
      const file = this.storage.bucket(this.bucket).file(path);
      const stream = file.createWriteStream();
      stream.on('finish', async () => {
        return await file.setMetadata({
          metadata: object,
        });
      });
      stream.end(media);
      return `https://storage.googleapis.com/bucker-endpoint-api-fontfound/${path}`;
    } catch (error) {
      return {
        message: 'Failed to save media',
        error: error,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async delete(path: string) {
    await this.storage
      .bucket(this.bucket)
      .file(path)
      .delete({ ignoreNotFound: true });
  }
}
