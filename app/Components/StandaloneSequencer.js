import React, { useState, useEffect, useRef } from 'react';

function Controls({ play, setBPM, bpm, buttonText }) {
  return (
    <div id="sequencer-controls">
      <button id="play-button" onClick={play}>
        {buttonText}
      </button>
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
    </div>
  );
}

function Pad({ sequence, pads, id }) {
  const [note, setNote] = useState('D1');

  function toggleActive(e) {
    const currentPad = e.target;
    if (currentPad.classList.contains('active')) {
      currentPad.classList.remove('active');
      const _sequence = sequence.current
        .slice(0, currentPad.id)
        .concat([[]])
        .concat(sequence.current.slice(parseInt(currentPad.id) + 1));
      sequence.current = _sequence;
    } else {
      currentPad.classList.add('active');
      const _sequence = sequence.current
        .slice(0, currentPad.id)
        .concat([note])
        .concat(sequence.current.slice(parseInt(currentPad.id) + 1));
      sequence.current = _sequence;
    }
  }

  function updateNote(e) {
    const currentPadID = e.target.id;
    const _note = e.target.value;
    if (pads.current[currentPadID].classList.contains('active')) {
      const _sequence = sequence.current
        .slice(0, currentPadID)
        .concat([[_note]])
        .concat(sequence.current.slice(parseInt(currentPadID) + 1));
      sequence.current = _sequence;
    }
    setNote(_note);
  }

  return (
    <div className="pad-container">
      <div className="pad" id={id} onClick={(e) => toggleActive(e)}>
        {id + 1}
      </div>
      <input
        className="note-value"
        value={note}
        onChange={(e) => updateNote(e)}
        id={id}
      ></input>
    </div>
  );
}

export default function Sequencer({ synth }) {
  const _synth = useRef();
  const sequence = useRef([]);
  const pads = useRef([]);
  const [playing, setPlaying] = useState(false);
  const [buttonText, setButtonText] = useState('play');
  const beat = useRef(0);
  const [bpmVal, setBpmVal] = useState(120);
  const bpm = useRef(bpmVal);
  const length = 16;

  function setBPM(e) {
    bpm.current = e.target.value;
    setBpmVal(e.target.value);
  }

  function play() {
    Tone.Transport.toggle();
    if (!playing) {
      setPlaying(true);
      setButtonText('pause');
    } else {
      setPlaying(false);
      setButtonText('play');
    }
  }

  useEffect(() => {
    const _sequence = [];
    for (let i = 0; i < length; i++) {
      _sequence.push([]);
    }
    const _pads = Array.from(document.getElementsByClassName('pad'));
    sequence.current = _sequence;
    pads.current = _pads;
  }, []);

  useEffect(() => {
    function repeat(time) {
      const currentSound = sequence.current[beat.current][0];
      const currentPad = pads.current[beat.current];
      let previousPad = pads.current[beat.current - 1];
      if (!previousPad) {
        previousPad = pads.current[length - 1];
      }
      previousPad.classList.remove('current');
      currentPad.classList.add('current');
      if (currentSound) {
        _synth.current.triggerAttackRelease(
          currentSound,
          _synth.current.envelope.release,
          time
        );
      }
      beat.current = (beat.current + 1) % sequence.current.length;
    }

    Tone.Transport.scheduleRepeat(repeat, `${length}n`);
  }, []);

  useEffect(() => {
    Tone.Transport.bpm.value = parseInt(bpm.current);
  }, [bpm.current]);

  useEffect(() => {
    _synth.current = synth;
  }, [synth]);

  return (
    <div id="transport-container">
      <Controls
        play={play}
        setBPM={setBPM}
        bpm={bpm}
        buttonText={buttonText}
      ></Controls>
      <div id="sequence-grid">
        {new Array(length).fill('').map((_, i) => {
          return <Pad id={i} key={i} sequence={sequence} pads={pads}></Pad>;
        })}
      </div>
    </div>
  );
}
