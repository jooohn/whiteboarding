import { AppBar, Button, Fade, MenuItem, Select, Toolbar } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { delay, map, startWith, switchMap } from 'rxjs/operators';
import { useMouseMove$ } from '../mouse';
import { useFlipHorizontally, useFlipVertically } from '../recoil/control';
import { useLoadVideoStream, useSelectVideoStream, useVideoStreamState } from '../recoil/video-stream';

const controlAppearanceDuration = 2000;

function useShowControl(mouseMove$: Observable<MouseEvent>, enter$: Observable<boolean>): boolean {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const mouseMoved$ = mouseMove$.pipe(
      startWith(true),
      switchMap(() => of(false).pipe(
        delay(controlAppearanceDuration),
        startWith(true),
      )),
    );

    const mouseWasOnControl$ = enter$.pipe(
      startWith(false),
      switchMap(entering => entering
        ? of(true)
        : of(false).pipe(delay(controlAppearanceDuration)),
      ),
    );
    const subscription = combineLatest([mouseMoved$, mouseWasOnControl$]).pipe(
      map(([mouseMoved, mouseWasOnControl]) => mouseMoved || mouseWasOnControl),
    ).subscribe(setShow);
    return () => subscription.unsubscribe();
  }, [mouseMove$, enter$, setShow]);

  return show;
}

export const ControlContainer: React.FC = () => {
  const mouseMove$ = useMouseMove$();
  const enter$ = useMemo(() => new BehaviorSubject(false), []);
  const showControl = useShowControl(mouseMove$, enter$);
  const flipHorizontally = useFlipHorizontally();
  const flipVertically = useFlipVertically();
  const videoStreamState = useVideoStreamState();
  const loadVideoStream = useLoadVideoStream();
  const selectVideoStream = useSelectVideoStream();
  useEffect(() => loadVideoStream(), []);
  return (
    <div
      onMouseEnter={() => enter$.next(true)}
      onMouseLeave={() => enter$.next(false)}
    >
      <Fade in={showControl}>
        <AppBar color="default">
          <Toolbar>
            {videoStreamState.state === 'LOADED' ? (
              <Select
                value={videoStreamState.selected?.deviceId}
                onChange={e => {
                  const value = e.target.value;
                  if (typeof value === 'string') {
                    selectVideoStream(value);
                  }
                }}
              >
                {videoStreamState.videoInputDevices.map(device => (
                  <MenuItem
                    key={device.deviceId}
                    value={device.deviceId}
                  >
                    {device.label}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Button onClick={loadVideoStream}>
                Turn On Camera
              </Button>
            )}
            <Button onClick={flipHorizontally}>Flip Horizontally ⇆</Button>
            <Button onClick={flipVertically}>Flip Vertically ⇅</Button>
          </Toolbar>
        </AppBar>
      </Fade>
    </div>
  );
};

