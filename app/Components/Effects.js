import React, { useState, useEffect, useContext, useRef } from 'react';
import * as Tone from 'tone';
import { Slider, VerticalSlider } from './Sliders';
import { SequenceContext } from '../sequence-context';
import { delayTimes } from '../lib';

//     * * * * * * * * * * * * * * * * * * * * * *
//     *                                         *
//     *             LOCAL EFFECTS               *
//     *                                         *
//     * * * * * * * * * * * * * * * * * * * * * *

export function LFOModule({ output }) {
  const [lfo, setLfo] = useState(null);
  const [frequency, setFrequency] = useState(0.1);
  const [amplitude, setAmplitude] = useState(0);
  const [on, setOn] = useState(false);
  const onRef = useRef();

  useEffect(() => {
    const settings = {
      frequency: frequency,
      amplitude: amplitude,
      max: 5000,
      min: 0,
      debug: true,
    };
    if (!lfo) {
      const _lfo = new Tone.LFO(settings).start();
      setLfo(_lfo);
    } else {
      lfo.set(settings);
    }
  }, [frequency, amplitude]);

  function toggleLfo() {
    if (on) {
      setOn(false);
      onRef.current.classList.remove('active');
      lfo.disconnect();
    } else {
      setOn(true);
      onRef.current.classList.add('active');
      lfo.connect(output.frequency);
    }
  }

  return (
    <div className="effect-wrapper">
      <h3>lfo</h3>
      <div className="effect-wrapper-inner">
        <button ref={onRef} onClick={toggleLfo}>
          {on ? 'off' : 'on'}
        </button>
        <Slider
          name="frequency"
          max="10"
          min="0.1"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        ></Slider>
        <Slider
          name="amplitude"
          max="1"
          min="0"
          value={amplitude}
          onChange={(e) => setAmplitude(e.target.value)}
        ></Slider>
      </div>
    </div>
  );
}

export function FilterModule({ filter, setFilter }) {
  const [frequency, setFrequency] = useState(3000);
  const [resonance, setResonance] = useState(0);

  useEffect(() => {
    const settings = {
      frequency: frequency,
      Q: resonance,
      type: 'lowpass',
    };

    if (!filter) {
      const _filter = new Tone.Filter(settings);
      setFilter(_filter);
    } else {
      filter.set(settings);
    }
  }, [frequency, resonance]);

  return (
    <div className="effect-wrapper">
      <fieldset className="effect-wrapper-inner">
        <legend>filter</legend>
        <Slider
          name="frequency"
          max="3000"
          min="5"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        ></Slider>
        <Slider
          name="resonance"
          max={'40'}
          min={'0'}
          step={'1'}
          value={resonance}
          onChange={(e) => setResonance(e.target.value)}
        ></Slider>
      </fieldset>
    </div>
  );
}

export function PhaserModule({ phaser, setPhaser }) {
  const [frequency, setFrequency] = useState(0.5);
  const [resonance, setResonance] = useState(0.1);
  const [mix, setMix] = useState(0.5);

  useEffect(() => {
    const settings = {
      frequency: frequency,
      Q: resonance,
      wet: mix,
    };

    if (!phaser) {
      const _phaser = new Tone.Phaser(settings).toDestination();
      setPhaser(_phaser);
    } else {
      phaser.set(settings);
    }
  }, [frequency, resonance, mix]);

  return (
    <div className="effect-wrapper">
      <h3>phaser</h3>
      <div className="effect-wrapper-inner">
        <Slider
          name="frequency"
          max="15"
          min="0.01"
          step="0.1"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        ></Slider>
        <Slider
          name="resonance"
          max="1"
          value={resonance}
          onChange={(e) => setResonance(e.target.value)}
        ></Slider>
        <Slider
          name="mix"
          max="1"
          min="0"
          onChange={(e) => setMix(e.target.value)}
        ></Slider>
      </div>
    </div>
  );
}

//     * * * * * * * * * * * * * * * * * * * * * *
//     *                                         *
//     *            GLOBAL EFFECTS               *
//     *                                         *
//     * * * * * * * * * * * * * * * * * * * * * *

export function DelayModule() {
  const { masterGain, globalDelay } = useContext(SequenceContext);
  const [type, setType] = useState('bpm');
  const [delayTime, setDelayTime] = useState(type === 'bpm' ? '8n' : 0.5);
  const [feedback, setFeedback] = useState(0.5);

  useEffect(() => {
    const settings = {
      delayTime: delayTime,
      feedback: feedback,
      wet: 1,
    };

    if (!globalDelay.current) {
      const _delay = new Tone.FeedbackDelay(settings).connect(masterGain);
      globalDelay.current = _delay;
    } else {
      globalDelay.current.set(settings);
    }
  }, [delayTime, feedback]);

  return (
    <div className="effect-wrapper-vertical">
      <fieldset className="effect-wrapper-vertical-inner">
        <legend>delay</legend>
        {type == 'bpm' && (
          <form className="delay-selector">
            {delayTimes.map((time, i) => {
              return (
                <div className="delay-selector-wrapper" key={i}>
                  <input
                    type={'radio'}
                    name={'delayTime'}
                    id={time}
                    value={time}
                    onChange={(e) => setDelayTime(e.target.value)}
                  ></input>
                  <label
                    htmlFor={time}
                    className={`delay-selector-button ${
                      delayTime === time ? 'checked' : ''
                    }`}
                  >
                    {time.replace('n', '')}
                  </label>
                </div>
              );
            })}
          </form>
        )}
        {type === 'time' && (
          <Slider
            name="time"
            max="1"
            min="0.01"
            value={delayTime}
            onChange={(e) => setDelayTime(e.target.value)}
          ></Slider>
        )}
        <Slider
          name="amount"
          max="1"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></Slider>
      </fieldset>
    </div>
  );
}

export function ReverbModule() {
  const { masterGain, globalReverb } = useContext(SequenceContext);
  const [decay, setDecay] = useState(1);

  useEffect(() => {
    const settings = {
      decay: decay,
      wet: 1,
    };

    if (!globalReverb.current) {
      const _reverb = new Tone.Reverb(settings).connect(masterGain);
      globalReverb.current = _reverb;
    } else {
      globalReverb.current.set(settings);
    }
  }, [decay]);

  return (
    <div className="effect-wrapper-vertical">
      <fieldset className="effect-wrapper-vertical-inner">
        <legend>reverb</legend>
        <Slider
          name="decay"
          max="10"
          onChange={(e) => setDecay(e.target.value)}
        ></Slider>
      </fieldset>
    </div>
  );
}

//     * * * * * * * * * * * * * * * * * * * * * *
//     *                                         *
//     *             EFFECT SENDS                *
//     *                                         *
//     * * * * * * * * * * * * * * * * * * * * * *

export function Send({ send, setSend, output, name, initialGain = 0 }) {
  const [gain, setGain] = useState(initialGain);

  useEffect(() => {
    if (!send) {
      const _send = new Tone.Gain(gain).toDestination();
      setSend(_send);
    } else {
      send.set({ gain: gain });
    }
  }, [gain]);

  useEffect(() => {
    if (send && output) {
      send.disconnect();
      send.connect(output);
    }
  }, [send, output]);

  return (
    <Slider
      name={name}
      max="1"
      min="0"
      value={gain}
      onChange={(e) => {
        setGain(e.target.value);
      }}
    ></Slider>
  );
}
