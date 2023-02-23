import React from 'react';
import Synth from './Synth';
import DrumMachine from './DrumMachine';
import Sampler from './Sampler';
import Brain from './Brain';

export default function App() {
  return (
    <main>
      <div id="instruments">
        <Sampler name={'samplerPoly'} mode="poly"></Sampler>
        <Sampler name={'samplerMono'} mode="mono"></Sampler>
        <DrumMachine></DrumMachine>
      </div>
      <Brain></Brain>
    </main>
  );
}
