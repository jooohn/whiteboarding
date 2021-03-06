import { AppBar, Fade, IconButton, MenuItem, PropTypes, Select, Toolbar, Tooltip } from '@material-ui/core';
import { CameraAlt, Flip, Fullscreen } from '@material-ui/icons';
import React, { useEffect, useMemo, useState } from 'react';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { delay, map, startWith, switchMap } from 'rxjs/operators';
import {
  useControlValue,
  useFlipHorizontally,
  useFlipVertically,
  useToggleCamera,
} from '../recoil/control';
import { useMouseMove$ } from '../recoil/mouse';
import { useDeviceSelection, useSelectDevice, useVideo } from '../recoil/video-stream';

const controlAppearanceDuration = 2000;

function iconColor(active: boolean): PropTypes.Color {
  return active ? 'primary' : 'default';
}

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
  const control = useControlValue();
  const toggleCamera = useToggleCamera();
  const flipHorizontally = useFlipHorizontally();
  const flipVertically = useFlipVertically();
  const deviceSelection = useDeviceSelection();
  const selectDevice = useSelectDevice();
  const video = useVideo();
  return (
    <div
      onMouseEnter={() => enter$.next(true)}
      onMouseLeave={() => enter$.next(false)}
    >
      <Fade in={showControl}>
        <AppBar color="default">
          <Toolbar>
            <Tooltip title="Toggle camera">
              <IconButton
                onClick={toggleCamera}
                aria-label="toggle camera"
                color={iconColor(control.camera)}
              >
                <CameraAlt/>
              </IconButton>
            </Tooltip>
            {deviceSelection.deviceId && (
              <Select
                value={deviceSelection.deviceId}
                onChange={e => {
                  const value = e.target.value;
                  if (typeof value === 'string') {
                    selectDevice(value);
                  }
                }}
              >
                {deviceSelection.devices.map(device => (
                  <MenuItem
                    key={device.deviceId}
                    value={device.deviceId}
                  >
                    {device.label}
                  </MenuItem>
                ))}
              </Select>
            )}
            <Tooltip title="Flip horizontally">
              <IconButton
                onClick={flipHorizontally}
                aria-label="flip horizontally"
                color={iconColor(control.horizontallyFlipped)}
              >
                <Flip/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Flip vertically">
              <IconButton
                onClick={flipVertically}
                aria-label="flip vertically"
                color={iconColor(control.verticallyFlipped)}
              >
                <Flip style={{transform: 'rotate(0.25turn)'}} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Full screen">
              <IconButton
                onClick={() => {
                  if (video) {
                    video.requestFullscreen().then(console.error);
                  }
                }}
                aria-label="toggle full screen"
              >
                <Fullscreen/>
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </Fade>
    </div>
  );
};

