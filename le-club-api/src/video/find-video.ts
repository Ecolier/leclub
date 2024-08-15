import { VideoModel } from "./video.model";

function findVideo (id: string) {
  return VideoModel.findById(id);
}

export default findVideo;