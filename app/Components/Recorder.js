import React, { useEffect, useState, useRef } from 'react';
import * as Tone from 'tone';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function RecorderModule({ mains, play, playing }) {
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());

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
    const audioURL = await extractAudio(url);

    const a = document.createElement('a');
    a.download = 'recording.mp3';
    a.href = audioURL;
    a.click();
    a.remove();
  }

  async function extractAudio(url) {
    const ffmpeg = ffmpegRef.current;

    const inputName = 'input.webm';
    const outputName = 'output.mp3';

    ffmpeg.writeFile(inputName, await fetchFile(url));

    await ffmpeg.exec(['-i', inputName, outputName]);

    const output = await ffmpeg.readFile(outputName);

    const _blob = new Blob([output.buffer]);
    const _audioURL = URL.createObjectURL(_blob);

    ffmpeg.deleteFile(inputName);
    ffmpeg.deleteFile(outputName);
    return _audioURL;
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

  useEffect(() => {
    const load = async () => {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      const ffmpeg = ffmpegRef.current;
      if (!ffmpeg.loaded) {
        await ffmpeg.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            'text/javascript'
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            'application/wasm'
          ),
        });
        setLoaded(true);
      }
    };
    load();
  }, []);

  return (
    <div className="recorder-body">
      <div id="recorder-controls">
        {!recording && (
          <button
            id="record-button"
            onClick={startRecording}
            disabled={!loaded}
          >
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
