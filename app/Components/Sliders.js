import React from 'react';

export function Slider({ name, max, value, onChange, min = 0.1, step = 0.1 }) {
  return (
    <div className={'slider-container'}>
      <label htmlFor="name">{name}</label>
      <input
        className={'slider'}
        type={'range'}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
      ></input>
    </div>
  );
}

export function VerticalSlider({
  name,
  max,
  value,
  onChange,
  min = 0.1,
  step = 0.1,
}) {
  return (
    <div className={'slider-container-vertical'}>
      <label htmlFor="name">{name}</label>
      <input
        className={'slider-vertical'}
        type={'range'}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
      ></input>
    </div>
  );
}
