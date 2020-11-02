import { CssBaseline } from '@material-ui/core';
import React from 'react';
import './App.css';
import { ControlContainer } from './components/Control';
import { VideoContainer } from './components/Video';
import { useTrackMouseMove } from './recoil/mouse';

const MouseTracking: React.FC = () => {
  useTrackMouseMove(document.body);
  return null;
};

const App: React.FC = () => {
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
