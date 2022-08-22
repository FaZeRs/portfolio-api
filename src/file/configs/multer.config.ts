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
    const endpoint: Endpoint = {
      hostname: this.configService.get('awsS3.endPoint'),
      // port: this.configService.get('awsS3.port'),
      protocol: 'http:',
      path: '/',
    };
    // const certs = [readFileSync('/path/to/cert.pem')];
    // const agent = new Agent({
    //   rejectUnauthorized: true,
    //   ca: certs,
    // });
    this.s3 = new S3Client({
      endpoint: endpoint,
      // endpoint: this.configService.get('awsS3.endPoint'),
      region: this.configService.get('awsS3.region'),
      credentials,
      // sslEnabled: false,
      tls: false,
      forcePathStyle: true,
      // signatureVersion: 'v4',
      logger: this.logger,
      // requestHandler: new NodeHttp2Handler(),
      // requestHandler: new NodeHttpHandler({
      //   httpAgent: new Agent(),
      // }),
      // httpOptions: {
      //   agent: new https.Agent({
      //     rejectUnauthorized: true,
      //     ca: certs
      //   })
      // }
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
