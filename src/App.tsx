import { CssBaseline } from '@material-ui/core';
import React from 'react';
import { RecoilRoot } from 'recoil';
import './App.css';
import { ControlContainer } from './components/Control';
import { useTrackMouseMove } from './mouse';
import { VideoContainer } from './components/Video';

const MouseTracking: React.FC = () => {
  useTrackMouseMove(document.body);
  return null;
};

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <CssBaseline/>
      <MouseTracking/>
      <ControlContainer/>
      <VideoContainer/>
    </RecoilRoot>
  );
}

export default App;
