import React, { Ref, useCallback, useEffect, useState } from 'react';
import { useControlValue } from '../recoil/control';
import { useVideoStream } from '../recoil/video-stream';

export const VideoContainer: React.FC = () => {
  const { camera, horizontallyFlipped, verticallyFlipped } = useControlValue();
  const videoStream = useVideoStream();
  const [video, setVideo] = useState<HTMLVideoElement | undefined>();
  const ref = useCallback(node => {
    setVideo(node ?? undefined);
  }, [setVideo]);
  useEffect(() => {
    if (!video || !videoStream) {
      return;
    }
    const listener = () => video.play();
    video.addEventListener('loadedmetadata', listener);
    video.srcObject = videoStream;
    return () => {
      video.removeEventListener('loadedmetadata', listener);
      video.pause();
      video.srcObject = null;
    }
  }, [video, videoStream, camera]);
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
