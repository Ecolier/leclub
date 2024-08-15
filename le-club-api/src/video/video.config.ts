import { Logger } from "winston";
import { getEnvironment } from "@leclub/shared";

export const getVideoConfig = (logger: Logger) => ({
  bucket: getEnvironment('AWS_S3_BUCKET_NAME', {
    logger
  })
});

export type VideoConfig = ReturnType<typeof getVideoConfig>;