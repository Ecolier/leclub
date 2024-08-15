import uploadVideo from "./upload-video";
import { VideoUploadInput } from "./video-upload-input.model";
import { VideoConfig } from "./video.config";

const uploadVideoResolver = (config: VideoConfig) => 
  async (parent: any, props: { upload: VideoUploadInput }) => {
  const { file, tags, players, event } = props.upload;
  const { mimetype, encoding, createReadStream } = await file;
  const { url } = await uploadVideo(config)({
    payload: createReadStream(),
    type: mimetype,
    encoding,
    tags,
    players,
    event
  });
  return {
    url, tags, event, players
  }
}

export default uploadVideoResolver;