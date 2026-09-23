// Physical book used by the 3D cover in the hero (Rowohlt hardcover, 256 pages).
// The 3D model scales from these numbers automatically.
import type { ImageMetadata } from 'astro';
import spine from '../assets/book-spine.jpg';

export const book: {
  widthMm: number;
  heightMm: number;
  /** Total thickness including both boards (spine photo ratio 1310:142 at 190 mm height ≈ 21 mm). */
  depthMm: number;
  /** Thickness of each cover board. */
  boardMm: number;
  /** How far the pages sit inside the boards (top, bottom and open side). */
  squaresMm: number;
  /** Distance of the hinge groove on the front cover from the spine (kept left of the rororo box, which starts at ~6.5 mm). */
  hingeMm: number;
  finish: 'matte' | 'gloss';
  /** Straight-on photo of the spine, upright, text reading bottom-to-top. */
  spine?: ImageMetadata;
  /** Optional photo of the back cover. */
  back?: ImageMetadata;
} = {
  widthMm: 125,
  heightMm: 190,
  depthMm: 21,
  boardMm: 2.5,
  squaresMm: 0.8,
  hingeMm: 3.5,
  finish: 'matte',
  spine,
};
