import { VideoModel, VideoUpload } from "./video.model";
import * as aws from 'aws-sdk';
import mongoose from "mongoose";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { VideoConfig } from "./video.config";
import { EventModel } from "../event/event.model";

const uploadVideo = (props: VideoConfig) => 
async ({ players, tags, event, type, encoding, payload }: VideoUpload) => {
  const relatedEvent = await EventModel.findById(event)
  if (!relatedEvent) {
    throw new Error(`Could not find event ${event}`)
  }
  const s3 = new aws.S3();
  const _id = new mongoose.Types.ObjectId();
  const params: PutObjectRequest = {
    Bucket: props.bucket,
    Key: `${_id}.${type.split('/')[1]}`,
    Body: payload,
    ACL: 'public-read',
    ContentEncoding: encoding,
    ContentType: type
  }
  const { Location: url } = await s3.upload(params).promise();
  return new VideoModel({
    _id, players, tags, event, url
  }).save();
}

export default uploadVideo;