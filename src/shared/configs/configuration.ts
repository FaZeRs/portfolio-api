export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    // url: process.env.DB_URL,
  },
  jwt: {
    publicKey: Buffer.from(
      process.env.JWT_PUBLIC_KEY_BASE64,
      'base64',
    ).toString('utf8'),
    privateKey: Buffer.from(
      process.env.JWT_PRIVATE_KEY_BASE64,
      'base64',
    ).toString('utf8'),
    accessTokenExpiresInSec: parseInt(
      process.env.JWT_ACCESS_TOKEN_EXP_IN_SEC,
      10,
    ),
    refreshTokenExpiresInSec: parseInt(
      process.env.JWT_REFRESH_TOKEN_EXP_IN_SEC,
      10,
    ),
  },
  defaultAdminUserPassword: process.env.DEFAULT_ADMIN_USER_PASSWORD,
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  multer: {
    dest: process.env.MULTER_DEST,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  // minio: {
  //   endPoint: process.env.MINIO_ENDPOINT,
  //   port: parseInt(process.env.MINIO_PORT),
  //   bucketName: process.env.MINIO_BUCKET_NAME,
  //   accessKey: process.env.MINIO_ACCESS_KEY,
  //   secretKey: process.env.MINIO_SECRET_KEY,
  // },
  awsS3: {
    endPoint: process.env.AWS_S3_ENDPOINT,
    // port: parseInt(process.env.AWS_S3_PORT),
    accessKey: process.env.AWS_S3_ACCESS_KEY,
    secretKey: process.env.AWS_S3_SECRET_KEY,
    bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_S3_REGION,
  },
});
