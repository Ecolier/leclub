import findVideo from "./find-video";

async function findVideoResolver (parent: any, props: { id: string }) {
  const video = await findVideo(props.id);
  if (!video) {
    throw new Error('No video for this ID.');
  } 
  return {
    url: video.url,
    tags: video.tags, 
    event: video.event?.toString(),
    players: video.players?.map(player => player.toString())
  }
}

export default findVideoResolver;