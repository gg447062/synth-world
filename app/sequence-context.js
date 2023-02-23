import React, { createContext, useRef } from 'react';
import * as Tone from 'tone';

export const SequenceContext = createContext();

export function SequenceContextProvider({ children }) {
  const synths = useRef([]);
  const sequence = useRef([]);
  const pads = useRef([]);
  const length = 16;
  const globalDelay = useRef();
  const globalReverb = useRef();
  const masterGain = new Tone.Gain(1).toDestination();

  const state = {
    synths,
    sequence,
    pads,
    length,
    globalDelay,
    globalReverb,
    masterGain,
  };

  return (
    <SequenceContext.Provider value={state}>
      {children}
    </SequenceContext.Provider>
  );
}
