import React, { Ref, useCallback, useEffect, useState } from 'react';
import { useControlValue } from '../recoil/control';
import { useVideoStreamState } from '../recoil/video-stream';

export const VideoContainer: React.FC = () => {
  const { horizontallyFlipped, verticallyFlipped } = useControlValue();
  const videoStreamState = useVideoStreamState();
  const [video, setVideo] = useState<HTMLVideoElement | undefined>();
  const ref = useCallback(node => {
    setVideo(node ?? undefined);
  }, [setVideo]);
  useEffect(() => {
    if (!video || videoStreamState.state !== 'LOADED' || !videoStreamState.selected) {
      return;
    }
    const listener = () => video.play();
    video.addEventListener('loadedmetadata', listener);
    video.srcObject = videoStreamState.selected.stream;
    return () => video.removeEventListener('loadedmetadata', listener);
  }, [video, videoStreamState]);
  if (videoStreamState.state !== 'LOADED' || !videoStreamState.selected) {
    return null;
  }
  return (
    <Video
      ref={ref}
      horizontallyFlipped={horizontallyFlipped}
      verticallyFlipped={verticallyFlipped}
    />
  );
};

export const Video = React.forwardRef(({ horizontallyFlipped, verticallyFlipped }: {
  horizontallyFlipped: boolean;
  verticallyFlipped: boolean;
}, ref: Ref<HTMLVideoElement>) => (
  <video
    ref={ref}
    style={{
      height: '100%',
      width: '100%',
      display: 'block',
      transform: `scale(${horizontallyFlipped ? '-1' : '1'}, ${verticallyFlipped ? '-1' : 1})`,
    }}
  />
));

