import { CssBaseline } from '@material-ui/core';
import React from 'react';
import './App.css';
import { ControlContainer } from './components/Control';
import { VideoContainer } from './components/Video';
import { useControlValue } from './recoil/control';
import { useTrackMouseMove } from './recoil/mouse';
import { useLoadVideoStream } from './recoil/video-stream';

const MouseTracking: React.FC = () => {
  useTrackMouseMove(document.body);
  return null;
};

const App: React.FC = () => {
  const { camera } = useControlValue();
  useLoadVideoStream(camera);
  return (
    <>
      <CssBaseline/>
      <MouseTracking/>
      <ControlContainer/>
      <VideoContainer/>
    </>
  );
}

export default App;
