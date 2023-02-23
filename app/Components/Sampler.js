import React, { useEffect, useState, useContext, useRef } from 'react';
import * as Tone from 'tone';
import { Slider } from './Sliders';
import Sequencer from './Sequencer';
import {
  sampleNames,
  urls,
  initialMonoSample,
  initialPolySample,
  baseURL,
} from '../lib';
import { SequenceContext } from '../sequence-context';
import { FilterModule, Send } from './Effects';

function ToneSelector({ handleSwitchSamples, initialSample }) {
  return (
    <div className="tone-selector">
      <label>tone</label>
      <select
        onChange={(e) => {
          handleSwitchSamples(e);
        }}
        defaultValue={initialSample}
      >
        {sampleNames.map((name, i) => {
          return (
            <option key={i} value={name}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function EnvControl({ val, onChange, name, min }) {
  return (
    <div className="sampler-env-control">
      <label htmlFor={name}>{name}</label>
      <input
        type="number"
        name={name}
        id={name}
        max="2"
        min={min}
        step="0.1"
        value={val}
        onChange={(e) => onChange(e.target.value)}
      ></input>
    </div>
  );
}

export default function Sampler({ name, mode = 'mono' }) {
  const { synths, globalDelay, globalReverb, masterGain } =
    useContext(SequenceContext);
  const initialSample = mode === 'mono' ? initialMonoSample : initialPolySample;
  const [location, setLocation] = useState(null);
  const [sampler, setSampler] = useState(null);
  const [attack, setAttack] = useState(0);
  const [release, setRelease] = useState(0.5);
  const [volume, setVolume] = useState(0);
  const [unmutedVolume, setUnmutedVolume] = useState(0);
  const [muted, setMuted] = useState(false);
  const [currentSample, setCurrentSample] = useState(initialSample);
  const [previousSample, setPreviousSample] = useState(initialSample);
  const [reverbSend, setReverbSend] = useState(null);
  const [delaySend, setDelaySend] = useState(null);
  const [filter, setFilter] = useState(null);
  const muteButton = useRef();

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
      urls: urls[currentSample],
      baseUrl: `${baseURL}/${currentSample}/`,
      attack: attack,
      release: release,
      volume: volume,
    };

    function updateSampler(i) {
      const _sampler = new Tone.Sampler(settings);
      synths.current[i] = _sampler;
      setSampler(_sampler);
    }

    if (location === null) {
      const _location = synths.current.length;
      updateSampler(_location);
      setLocation(_location);
    } else if (previousSample !== currentSample) {
      sampler.dispose();
      updateSampler(location);
      setPreviousSample(currentSample);
    } else {
      sampler.set(settings);
      synths.current[location] = sampler;
    }
  }, [attack, release, volume, currentSample, previousSample]);

  useEffect(() => {
    if (sampler && filter && reverbSend && delaySend) {
      sampler.connect(filter);
      filter.fan(reverbSend, delaySend, masterGain);
    }
  }, [sampler, filter, delaySend, reverbSend]);

  return (
    <div className={`sampler-container-${mode}`}>
      <div className="sampler-top-panel">
        <div className="sampler-top-panel-left">
          <fieldset className="sampler-tone-selection">
            <legend>{mode} synth</legend>
            <ToneSelector
              handleSwitchSamples={handleSwitchSamples}
              currentSample={currentSample}
              initialSample={initialSample}
            ></ToneSelector>
            <div className="sampler-attack-release">
              <EnvControl
                val={attack}
                onChange={setAttack}
                name="attack"
                min="0"
              ></EnvControl>
              <EnvControl
                val={release}
                onChange={setRelease}
                name="release"
                min="0.1"
              ></EnvControl>
            </div>
          </fieldset>
        </div>

        <div className="sampler-top-panel-middle">
          <FilterModule filter={filter} setFilter={setFilter}></FilterModule>
          <fieldset className="effect-wrapper-inner">
            <legend>sends</legend>
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
          </fieldset>
        </div>
        <fieldset className="sampler-top-panel-right">
          <legend>output</legend>
          <div className="sampler-volume-controls">
            <Slider
              name="volume"
              max="6"
              min="-48"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            ></Slider>
            <button
              className="mute-button"
              ref={muteButton}
              onMouseUp={handleToggleMute}
            >
              mute
            </button>
          </div>
        </fieldset>
      </div>
      <div className="sampler-bottom-panel">
        <Sequencer name={name} mode={mode}></Sequencer>
      </div>
    </div>
  );
}
