import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environtment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION,
  awsBucketName: process.env.AWS_PUBLIC_BUCKET_NAME,
  awsRegion: process.env.AWS_REGION,
  awsCloudFrontUrl: process.env.AWS_CLOUDFRONT_URL,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_KEY,
  mailHost: process.env.MAIL_HOST,
  mailSmtpUserName: process.env.MAIL_SMTP_USERNAME,
  mailSmtpPassword: process.env.MAIL_SMTP_PASSWORD,
}));
