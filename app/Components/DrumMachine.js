import React, { useEffect, useState, useContext, useRef } from 'react';
import * as Tone from 'tone';
import Sequencer from './Sequencer';
import { baseURL, drumSamples, initialDrumSample } from '../lib';
import { SequenceContext } from '../sequence-context';
import { Send } from './Effects';
import { Slider } from './Sliders';

function Channel({ name, destination }) {
  const { synths } = useContext(SequenceContext);
  const [location, setLocation] = useState(null);
  const [sampler, setSampler] = useState();
  const [volume, setVolume] = useState(0);
  const muteButton = useRef();
  const [unmutedVolume, setUnmutedVolume] = useState(0);
  const [muted, setMuted] = useState(false);
  const [currentSample, setCurrentSample] = useState(initialDrumSample);
  const [previousSample, setPreviousSample] = useState(initialDrumSample);

  function handleSwitchSamples(e) {
    setPreviousSample(currentSample);
    setCurrentSample(e.target.value);
  }

  function handleToggleMute() {
    if (muted) {
      setMuted(false);
      setVolume(unmutedVolume);
      muteButton.current.classList.remove('active');
    } else {
      setMuted(true);
      setUnmutedVolume(volume);
      setVolume(-60);
      muteButton.current.classList.add('active');
    }
  }

  useEffect(() => {
    const settings = {
      urls: { D1: `${currentSample}.wav` },
      baseUrl: `${baseURL}/DRUMS/`,
      attack: 0,
      release: 2,
      volume: volume,
    };

    function updateSampler(i) {
      const _sampler = new Tone.Sampler(settings);
      synths.current[i] = _sampler;
      setSampler(_sampler);
    }

    if (location === null) {
      const _location = synths.current.length;
      setLocation(_location);
      updateSampler(_location);
    } else if (previousSample !== currentSample) {
      sampler.dispose();
      updateSampler(location);
      setPreviousSample(currentSample);
    } else {
      sampler.set(settings);
      synths.current[location] = sampler;
    }
  }, [currentSample, volume]);

  useEffect(() => {
    if (sampler && destination) {
      sampler.connect(destination);
    }
  }, [sampler, destination]);

  return (
    <div className="drum-machine-channel">
      <div className="channel-controls">
        <div className="channel-controls-top">
          <select className="drum-selector" onChange={handleSwitchSamples}>
            {drumSamples.map((sample, i) => {
              return (
                <option key={i} value={sample}>
                  {sample}
                </option>
              );
            })}
          </select>
          <button
            className="mute-button"
            ref={muteButton}
            onMouseUp={handleToggleMute}
          >
            mute
          </button>
        </div>

        <Slider
          name="volume"
          max="6"
          min="-48"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        ></Slider>
      </div>

      <Sequencer name={name}></Sequencer>
    </div>
  );
}

export default function DrumMachine() {
  const { globalReverb, globalDelay, masterGain } = useContext(SequenceContext);
  const [mainOut, setMainOut] = useState(null);
  const [reverbSend, setReverbSend] = useState(null);
  const [delaySend, setDelaySend] = useState(null);
  const channels = 6;

  useEffect(() => {
    if (mainOut && reverbSend && delaySend) {
      mainOut.disconnect();
      mainOut.fan(reverbSend, delaySend, masterGain);
    }
  }, [mainOut, delaySend, reverbSend]);

  return (
    <div className="drum-machine">
      <div className="drum-machine-top-row">
        <p className="drum-machine-title">drum machine</p>
        <fieldset className="effect-wrapper-inner">
          <legend>output</legend>
          <Send
            send={reverbSend}
            setSend={setReverbSend}
            output={globalReverb.current}
            name={'reverb'}
          ></Send>
          <Send
            send={delaySend}
            setSend={setDelaySend}
            output={globalDelay.current}
            name={'delay'}
          ></Send>
          <Send
            send={mainOut}
            setSend={setMainOut}
            output={masterGain}
            name={'main volume'}
            initialGain={0.8}
          ></Send>
        </fieldset>
      </div>
      {Array(channels)
        .fill(0)
        .map((_, i) => {
          return (
            <Channel
              name={`channel${i}`}
              destination={mainOut}
              key={i}
            ></Channel>
          );
        })}
    </div>
  );
}
