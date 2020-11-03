import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

export type Control = {
  camera: boolean;
  horizontallyFlipped: boolean;
  verticallyFlipped: boolean;
}

const control = atom<Control>({
  key: 'control',
  default: {
    camera: true,
    horizontallyFlipped: false,
    verticallyFlipped: false,
  },
});

export function useControlValue(): Control {
  return useRecoilValue(control);
}

export function useToggleCamera() {
  const setControl = useSetRecoilState(control);
  return () => setControl(current => ({
    ...current,
    camera: !current.camera,
  }));
}

export function useFlipHorizontally() {
  const setControl = useSetRecoilState(control)
  return () => setControl(current => ({
    ...current,
    horizontallyFlipped: !current.horizontallyFlipped,
  }));
}

export function useFlipVertically() {
  const setControl = useSetRecoilState(control)
  return () => setControl(current => ({
    ...current,
    verticallyFlipped: !current.verticallyFlipped,
  }))
}
