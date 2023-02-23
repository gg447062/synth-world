import React, { useState, useEffect, useRef, useContext } from 'react';
import * as Tone from 'tone';
import { SequenceContext } from '../sequence-context';
import { ReverbModule, DelayModule } from './Effects';
import RecorderModule from './Recorder';

function Controls({ play, setBPM, bpm, playing }) {
  const { masterGain } = useContext(SequenceContext);
  return (
    <fieldset id="sequencer-controls">
      <legend>main controls</legend>
      <div id="bpm-input">
        <label>bpm </label>
        <input
          type={'number'}
          min={50}
          max={240}
          step={1}
          value={bpm.current}
          onChange={(e) => {
            setBPM(e);
          }}
        ></input>
      </div>
      <button id="play-button" onClick={play}>
        {playing ? (
          <span className="material-symbols-rounded">pause</span>
        ) : (
          <span className="material-symbols-rounded">play_arrow</span>
        )}
      </button>
      <RecorderModule
        mains={masterGain}
        play={play}
        playing={playing}
      ></RecorderModule>
    </fieldset>
  );
}

export default function Brain() {
  const { synths, sequence, pads, length, masterGain } =
    useContext(SequenceContext);
  const [playing, setPlaying] = useState(false);
  const beat = useRef(0);
  const [bpmVal, setBpmVal] = useState(120);
  const bpm = useRef(bpmVal);

  function setBPM(e) {
    bpm.current = e.target.value;
    setBpmVal(e.target.value);
  }

  function play() {
    Tone.Transport.toggle();
    setPlaying(!playing);
  }

  useEffect(() => {
    function repeat(time) {
      for (let i = 0; i < sequence.current.length; i++) {
        const currentSound = sequence.current[i][beat.current][0];
        const currentPad = pads.current[i][beat.current];
        let previousPad = pads.current[i][beat.current - 1];
        if (!previousPad) {
          previousPad = pads.current[i][length - 1];
        }
        previousPad.classList.remove('current');
        currentPad.classList.add('current');
        if (currentSound) {
          if (synths.current[i].name == 'Sampler') {
            synths.current[i].triggerAttackRelease(
              currentSound,
              synths.current[i].release,
              time
            );
          } else if (synths.current[i].name == 'Player') {
            synths.current[i].start(time);
          } else {
            synths.current[i].triggerAttackRelease(
              currentSound,
              synths.current[i].envelope.release,
              time
            );
          }
        }
      }
      beat.current = (beat.current + 1) % length;
    }

    Tone.Transport.scheduleRepeat(repeat, `${length}n`);
  }, []);

  useEffect(() => {
    Tone.Transport.bpm.value = parseInt(bpm.current);
  }, [bpm.current]);

  return (
    <div id={'skull'}>
      <Controls
        play={play}
        setBPM={setBPM}
        bpm={bpm}
        playing={playing}
      ></Controls>
      <ReverbModule></ReverbModule>
      <DelayModule></DelayModule>
    </div>
  );
}
