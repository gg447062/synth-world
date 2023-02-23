import React, { useEffect, useState, useContext } from 'react';
import { VerticalSlider } from './Sliders';
import Sequencer from './Sequencer';
import { SequenceContext } from '../sequence-context';

const waves = ['square', 'sine', 'sawtooth', 'triangle'];

function WaveSelector({ name, value, waveform, onChange }) {
  return (
    <div className="wave-selector-wrapper">
      <input
        type={'radio'}
        name={name}
        value={value}
        onChange={onChange}
        checked={waveform === value}
      ></input>
      <label>{value}</label>
    </div>
  );
}

export default function Synth({ name }) {
  const { synths } = useContext(SequenceContext);
  const [location, setLocation] = useState(null);
  const [synth, setSynth] = useState(null);
  const [waveform, setWaveform] = useState('square');
  const [volume, setVolume] = useState(-8);
  const [envAttack, setEnvAttack] = useState(0.5);
  const [envDecay, setEnvDecay] = useState(0.3);
  const [envSustain, setEnvSustain] = useState(0.5);
  const [envRelease, setEnvRelease] = useState(0.4);
  const [filterQ, setFilterQ] = useState(1);
  const [filterFrequency, setFilterFrequency] = useState(1000);
  {
    /* maybe give attack a lower min and step value */
  }
  const [filterAttack, setFilterAttack] = useState(0.1);
  const [filterDecay, setFilterDecay] = useState(0.7);
  const [filterSustain, setFilterSustain] = useState(0.5);
  const [filterRelease, setFilterRelease] = useState(0.4);

  useEffect(() => {
    const settings = {
      volume: volume,
      detune: 0,
      portamento: 0,
      envelope: {
        attack: envAttack,
        attackCurve: 'linear',
        decay: envDecay,
        decayCurve: 'exponential',
        release: envRelease,
        releaseCurve: 'exponential',
        sustain: envSustain,
      },
      filter: {
        Q: filterQ,
        frequency: 300,
        gain: 10,
        rolloff: -12,
        type: 'lowpass',
      },
      filterEnvelope: {
        attack: filterAttack,
        attackCurve: 'linear',
        decay: filterDecay,
        decayCurve: 'exponential',
        release: filterRelease,
        releaseCurve: 'exponential',
        sustain: filterSustain,
        baseFrequency: filterFrequency,
        exponent: 2,
        octaves: 4,
      },
      oscillator: {
        type: waveform,
      },
    };

    if (location === null) {
      const _synth = new Tone.MonoSynth(settings).toDestination();
      const _location = synths.current.length;
      synths.current[_location] = _synth;
      setLocation(_location);
      setSynth(_synth);
    } else {
      synth.set(settings);
      synths.current[location] = synth;
    }
  }, [
    waveform,
    volume,
    envAttack,
    envDecay,
    envSustain,
    envRelease,
    filterQ,
    filterFrequency,
    filterAttack,
    filterDecay,
    filterSustain,
    filterRelease,
  ]);

  return (
    <div className="synth-container">
      <div id="synth-controls">
        <div id="osc-controls">
          <h3>waveform</h3>
          <form id="waveselector">
            {waves.map((el, i) => {
              return (
                <WaveSelector
                  key={i}
                  name={'waveform'}
                  value={el}
                  waveform={waveform}
                  onChange={(e) => {
                    setWaveform(e.target.value);
                  }}
                ></WaveSelector>
              );
            })}
          </form>
        </div>
        <div id="envelope-container">
          <h3>env</h3>
          <div className="slider-wrapper">
            <VerticalSlider
              name={'a'}
              value={envAttack}
              max={2}
              onChange={(e) => {
                setEnvAttack(e.target.value);
              }}
            ></VerticalSlider>
            <VerticalSlider
              name={'d'}
              value={envDecay}
              max={2}
              onChange={(e) => {
                setEnvDecay(e.target.value);
              }}
            ></VerticalSlider>
            <VerticalSlider
              name={'s'}
              value={envSustain}
              max={1}
              onChange={(e) => {
                setEnvSustain(e.target.value);
              }}
            ></VerticalSlider>
            <VerticalSlider
              name={'r'}
              value={envRelease}
              max={2}
              onChange={(e) => {
                setEnvRelease(e.target.value);
              }}
            ></VerticalSlider>
          </div>
        </div>
        <div id="filter-container">
          <h3>filter</h3>
          <div className="slider-wrapper">
            <VerticalSlider
              name={'res'}
              value={filterQ}
              max={40}
              min={0}
              step={1}
              onChange={(e) => {
                setFilterQ(e.target.value);
              }}
            ></VerticalSlider>
            <VerticalSlider
              name={'freq'}
              value={filterFrequency}
              max={1500}
              min={0}
              step={1}
              onChange={(e) => {
                setFilterFrequency(e.target.value);
              }}
            ></VerticalSlider>
            <VerticalSlider
              name={'a'}
              max={2}
              value={filterAttack}
              onChange={(e) => {
                setFilterAttack(e.target.value);
              }}
            ></VerticalSlider>
            <VerticalSlider
              name={'d'}
              max={2}
              value={filterDecay}
              onChange={(e) => {
                setFilterDecay(e.target.value);
              }}
            ></VerticalSlider>
            <VerticalSlider
              name={'s'}
              max={1}
              value={filterSustain}
              onChange={(e) => {
                setFilterSustain(e.target.value);
              }}
            ></VerticalSlider>
            <VerticalSlider
              name={'r'}
              max={2}
              value={filterRelease}
              onChange={(e) => {
                setFilterRelease(e.target.value);
              }}
            ></VerticalSlider>
          </div>
        </div>
        <div id="volume-panel">
          <h3>amp</h3>
          <VerticalSlider
            name="vol"
            value={volume}
            max={2}
            min={-24}
            onChange={(e) => {
              setVolume(e.target.value);
            }}
          ></VerticalSlider>
        </div>
      </div>
      <Sequencer name={name}></Sequencer>
    </div>
  );
}
