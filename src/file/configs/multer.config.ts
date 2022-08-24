import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler, NodeHttp2Handler } from '@aws-sdk/node-http-handler';
import { Agent } from 'http';
import { Credentials, Endpoint } from '@aws-sdk/types';
import { readFileSync } from 'fs';

import { AppLogger } from '../../shared/logger/logger.service';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  protected s3: any;

  constructor(
    private configService: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(MulterConfigService.name);
    const credentials: Credentials = {
      accessKeyId: this.configService.get('awsS3.accessKey'),
      secretAccessKey: this.configService.get('awsS3.secretKey'),
    };

    this.s3 = new S3Client({
      endpoint: this.configService.get('awsS3.endPoint'),
      region: this.configService.get('awsS3.region'),
      credentials,
      tls: false,
      forcePathStyle: true,
      logger: this.logger,
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multerS3({
        s3: this.s3,
        bucket: this.configService.get('awsS3.bucket'),
        acl: 'read-public',
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (request, file, cb) {
          cb(null, `${Date.now().toString()}-${file.originalname}`);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
      }),
    };
  }
}
