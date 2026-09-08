import { FAIXA_MAX, FAIXA_MIN } from "./data";

export const SCALE_MIN = 45;
export const SCALE_MAX = 150;
export const TRACK_HEIGHT = 300;

export function yFor(value: number) {
  const clamped = Math.min(SCALE_MAX, Math.max(SCALE_MIN, value));
  const ratio = (clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN);
  return TRACK_HEIGHT - ratio * TRACK_HEIGHT;
}

export const BAND_TOP = yFor(FAIXA_MAX);
export const BAND_BOTTOM = yFor(FAIXA_MIN);

export const JITTER = [0, -20, 20, -10, 10, -30];
