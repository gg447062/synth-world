import React, { useState, useEffect, useContext } from 'react';
import { SequenceContext } from '../sequence-context';

export function ChordPad({
  localSequence,
  localPads,
  id,
  location,
  name,
  octaveOffset,
  currentGlobalOctave,
}) {
  const [notes, setNotes] = useState(['D1']);
  const { sequence } = useContext(SequenceContext);

  function updateSequence(newStep, int) {
    const _localSequence = localSequence.current
      .slice(0, int)
      .concat([newStep])
      .concat(localSequence.current.slice(parseInt(int) + 1));
    localSequence.current = _localSequence;

    sequence.current[location] = _localSequence;
  }

  function toggleActive(e) {
    const currentPad = e.target;
    if (currentPad.classList.contains('active')) {
      currentPad.classList.remove('active');
      updateSequence([], id);
    } else {
      currentPad.classList.add('active');
      updateSequence([notes], id);
    }
  }

  function cleanSequence(input) {
    const output = [];
    input.forEach((note) => {
      const octave = note.match(/[-]?\d/);
      let _note;
      if (octave) {
        _note = note.slice(0, octave.index);
      }
      if (octave && _note) {
        output.push(`${_note}${octave}`);
      }
    });
    return output;
  }

  function updateNotes(notes) {
    const notesList = notes.split(',');
    if (localPads.current[id].classList.contains('active')) {
      const safeSequence = cleanSequence(notesList);
      updateSequence([safeSequence], id);
    }

    setNotes(notesList);
  }

  function updateOctave(offset) {
    const notesList = [];
    notes.forEach((note) => {
      const octave = note.match(/[-]?\d/);
      const _note = note.slice(0, octave.index);
      if (octave && _note) {
        const _octave = parseInt(octave[0]) + parseInt(offset);
        notesList.push(`${_note}${_octave}`);
      }
    });

    setNotes(notesList);

    if (localPads.current[id].classList.contains('active')) {
      updateSequence([notesList], id);
    }
  }

  useEffect(() => {
    if (localPads.current.length > 0) {
      updateOctave(octaveOffset);
    }
  }, [currentGlobalOctave]);

  return (
    <div className={'pad-container'}>
      <div className={`pad ${name}`} id={id} onClick={(e) => toggleActive(e)}>
        {id + 1}
      </div>
      <div className="pad-update-container">
        <input
          className={`chord-value ${name}`}
          value={notes}
          onChange={(e) => updateNotes(e.target.value)}
          id={id}
        ></input>
      </div>
    </div>
  );
}

export function Pad({
  localSequence,
  localPads,
  id,
  location,
  name,
  octaveOffset,
  currentGlobalOctave,
}) {
  const [note, setNote] = useState('D');
  const [octave, setOctave] = useState(1);
  const { sequence } = useContext(SequenceContext);

  function updateSequence(newStep, int) {
    const _localSequence = localSequence.current
      .slice(0, int)
      .concat([newStep])
      .concat(localSequence.current.slice(parseInt(int) + 1));
    localSequence.current = _localSequence;
    sequence.current[location] = _localSequence;
  }

  function toggleActive(e) {
    const currentPad = e.target;
    const noteValue = [`${note}${octave}`];
    if (currentPad.classList.contains('active')) {
      currentPad.classList.remove('active');
      updateSequence([], id);
    } else {
      currentPad.classList.add('active');
      updateSequence(noteValue, id);
    }
  }

  function updateNote(_note) {
    if (localPads.current[id].classList.contains('active')) {
      const noteValue = [`${_note}${octave}`];
      updateSequence(noteValue, id);
    }
    setNote(_note);
  }

  function updateOctave(_octave) {
    if (localPads.current[id].classList.contains('active')) {
      const noteValue = `${note}${_octave}`;
      updateSequence([noteValue], id);
    }
    setOctave(parseInt(_octave));
  }

  useEffect(() => {
    if (localPads.current.length > 0) {
      updateOctave(octave + octaveOffset);
    }
  }, [currentGlobalOctave]);

  return (
    <div className={'pad-container'}>
      <div className={`pad ${name}`} id={id} onClick={(e) => toggleActive(e)}>
        {id + 1}
      </div>
      <div className="pad-update-container">
        <input
          className={`note-value ${name}`}
          value={note}
          onChange={(e) => updateNote(e.target.value)}
          id={id}
        ></input>
        <input
          className={`octave-value ${name}`}
          type="number"
          min="0"
          max="4"
          step="1"
          value={octave}
          onChange={(e) => updateOctave(e.target.value)}
          id={id}
        ></input>
      </div>
    </div>
  );
}
