import { useEffect } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { useErrorHandler } from '../error-handler';

export type DeviceSelection = {
  devices: MediaDeviceInfo[],
  deviceId: string | undefined,
};

const deviceSelection = atom<DeviceSelection>({
  key: 'devices',
  default: {
    devices: [],
    deviceId: undefined,
  },
});

export function useDeviceSelection(): DeviceSelection {
  return useRecoilValue(deviceSelection)
}

export function useSelectDevice(): (deviceId: string) => void {
  const setState = useSetRecoilState(deviceSelection);
  return deviceId => setState(selection => ({
    ...selection,
    deviceId,
  }));
}

const videoStream = atom<MediaStream | undefined>({
  key: 'videoStream',
  default: undefined,
});

export function useVideoStream(): MediaStream | undefined {
  return useRecoilValue(videoStream);
}

export function useLoadVideoStream(active: boolean) {
  const { deviceId } = useRecoilValue(deviceSelection);
  const setDevices = useSetRecoilState(deviceSelection);
  const setVideoStream = useSetRecoilState(videoStream);
  const errorHandler = useErrorHandler();

  useEffect(() => {
    if (active) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(async um => {
        um.getTracks().forEach(t => t.stop());
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter(({ kind }) => kind === 'videoinput');
        setDevices(({ deviceId, devices }) => ({
          devices: videoDevices,
          deviceId: videoDevices.some(vd => vd.deviceId === deviceId)
            ? deviceId
            : videoDevices[0]?.deviceId,
        }));
      });
    }
  }, [active, setVideoStream, setDevices]);

  useEffect(() => {
    if (!active || !deviceId) {
      setVideoStream(undefined);
      return;
    }
    const mediaStreamPromise = loadMediaStream(deviceId);
    mediaStreamPromise.then(setVideoStream).catch(errorHandler);
    return () => {
      mediaStreamPromise.then(ms => ms.getTracks().forEach(t => t.stop()));
    };
  }, [deviceId, active, errorHandler, setVideoStream]);
}

async function loadMediaStream(deviceId: string) {
  return await navigator.mediaDevices.getUserMedia({
    video: { deviceId: { exact: deviceId } }
  });
}
