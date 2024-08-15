import { Logger } from "winston";
import { getEnvironment } from '@leclub/shared';

export const getAWSConfig = (logger: Logger) => ({
  accessKeyId: getEnvironment('AWS_S3_BUCKET_ID', { logger }),
  secretAccessKey: getEnvironment('AWS_S3_BUCKET_SECRET', { logger }),
  region: getEnvironment('AWS_REGION', { logger }),
});

export type AWSConfig = ReturnType<typeof getAWSConfig>;