import { useEffect } from 'react';
import { atom, useRecoilValue } from 'recoil';
import { Observable, Subject } from 'rxjs';

const mouseMove$ = atom({
  key: 'mouseMove$',
  default: new Subject<MouseEvent>(),
});

export function useMouseMove$(): Observable<MouseEvent> {
  return useRecoilValue(mouseMove$);
}

export function useTrackMouseMove(element: HTMLElement) {
  const $ = useRecoilValue(mouseMove$);
  useEffect(() => {
    const listener = (event: MouseEvent) => $.next(event);
    element.addEventListener('mousemove', listener);
    return () => document.body.removeEventListener('mousemove', listener);
  }, [element, mouseMove$]);
}
