import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { useErrorHandler } from '../error-handler';

export type VideoStreamState =
  | { state: 'WAITING' }
  | { state: 'LOADING' }
  | { state: 'LOADED', selected: { stream: MediaStream, deviceId: string } | undefined, videoInputDevices: MediaDeviceInfo[] }

const waiting: VideoStreamState = { state: 'WAITING' };
const loading: VideoStreamState = { state: 'LOADING' };
function loaded(selected: { stream: MediaStream, deviceId: string } | undefined, videoInputDevices: MediaDeviceInfo[]): VideoStreamState {
  return { state: 'LOADED', selected, videoInputDevices };
}

const videoStream = atom<VideoStreamState>({
  key: 'videoStream',
  default: { state: 'WAITING' },
});

export function useVideoStreamState(): VideoStreamState {
  return useRecoilValue(videoStream);
}

async function loadVideoInputDevices() {
  await navigator.mediaDevices.getUserMedia({ video: true });
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(({ kind }) => kind === 'videoinput');
}

async function loadMediaStream(deviceId: string) {
  return await navigator.mediaDevices.getUserMedia({
    video: { deviceId: { exact: deviceId } }
  });
}

function useLoadVideoStreamState(): (f: (devices: MediaDeviceInfo[]) => string | undefined) => void {
  const setState = useSetRecoilState(videoStream);
  const errorHandler = useErrorHandler();
  return async f => {
    setState(loading);
    try {
      const videoInputDevices = await loadVideoInputDevices();
      const deviceId = f(videoInputDevices);
      if (!deviceId) {
        setState(loaded(undefined, videoInputDevices));
        return;
      }
      const stream = await loadMediaStream(deviceId);
      setState(loaded({ deviceId, stream }, videoInputDevices));
    } catch (e) {
      errorHandler(e);
      setState(waiting);
    }
  };
}

export function useLoadVideoStream(): () => void {
  const loadVideoStreamState = useLoadVideoStreamState();
  return () => loadVideoStreamState(devices => devices[0]?.deviceId);
}

export function useSelectVideoStream(): (deviceId: string) => void {
  const loadVideoStreamState = useLoadVideoStreamState();
  return (deviceId: string) => loadVideoStreamState(() => deviceId);
}
