import React, { useEffect, useState, useRef } from 'react';
import * as Tone from 'tone';

export default function RecorderModule({ mains, play, playing }) {
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);

  function startRecording() {
    recorder.start();
    setRecording(true);
  }

  async function stopRecording() {
    const recording = await recorder.stop();
    if (playing) {
      play();
    }
    setRecording(false);
    const url = URL.createObjectURL(recording);
    const a = document.createElement('a');
    a.download = 'recording.webm';
    a.href = url;
    a.click();
    a.remove();
  }

  useEffect(() => {
    if (!recorder) {
      const _recorder = new Tone.Recorder();
      setRecorder(_recorder);
    }
  }, [recorder]);

  useEffect(() => {
    if (recorder && mains) {
      mains.connect(recorder);
    }
  }, [recorder, mains]);

  return (
    <div className="recorder-body">
      <div id="recorder-controls">
        {!recording && (
          <button id="record-button" onClick={startRecording}>
            <span className="material-symbols-rounded">
              fiber_manual_record
            </span>
          </button>
        )}
        {recording && (
          <button id="stop-button" onClick={stopRecording}>
            <span className="material-symbols-rounded">stop</span>
          </button>
        )}
      </div>
    </div>
  );
}
