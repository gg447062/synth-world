import React, { useState, useEffect, useRef, useContext } from 'react';
import { SequenceContext } from '../sequence-context';
import { ChordPad, Pad } from './Pads';

export default function Sequencer({ name, mode = 'mono' }) {
  const { sequence, pads, length } = useContext(SequenceContext);
  const localSequence = useRef([]);
  const localPads = useRef([]);
  const [location, setLocation] = useState();
  const [currentGlobalOctave, setCurrentOctave] = useState(0);
  const [octaveOffset, setOctaveOffset] = useState(0);

  function globallyUpdateOctave(val) {
    setOctaveOffset(val);
    setCurrentOctave(currentGlobalOctave + val);
  }

  useEffect(() => {
    const _sequence = [];
    for (let i = 0; i < length; i++) {
      _sequence.push([]);
    }
    const _pads = Array.from(document.getElementsByClassName('pad')).filter(
      (el) => {
        return el.classList.contains(name);
      }
    );

    localSequence.current = _sequence;
    localPads.current = _pads;
    const _location = sequence.current.length;
    setLocation(_location);

    sequence.current = [...sequence.current, _sequence];
    pads.current = [...pads.current, _pads];
  }, []);

  return (
    <div id="transport-container">
      <div className="sequence-octave-control">
        <h4>octave</h4>
        <div className="octave-button-wrapper">
          <div
            className={'octave-button'}
            onClick={() => globallyUpdateOctave(-1)}
          >
            <span className="material-symbols-rounded">remove</span>
          </div>
          <div
            className={'octave-button'}
            onClick={() => globallyUpdateOctave(1)}
          >
            <span className="material-symbols-rounded">add</span>
          </div>
        </div>
      </div>
      {mode === 'poly' && (
        <div className="sequence-grid-poly">
          {new Array(length).fill().map((_, i) => {
            return (
              <ChordPad
                id={i}
                key={i}
                localSequence={localSequence}
                localPads={localPads}
                location={location}
                name={name}
                octaveOffset={octaveOffset}
                currentGlobalOctave={currentGlobalOctave}
              ></ChordPad>
            );
          })}
        </div>
      )}
      {mode === 'mono' && (
        <div className="sequence-grid-mono">
          {new Array(length).fill().map((_, i) => {
            return (
              <Pad
                id={i}
                key={i}
                localSequence={localSequence}
                localPads={localPads}
                location={location}
                name={name}
                octaveOffset={octaveOffset}
                currentGlobalOctave={currentGlobalOctave}
              ></Pad>
            );
          })}
        </div>
      )}
    </div>
  );
}
