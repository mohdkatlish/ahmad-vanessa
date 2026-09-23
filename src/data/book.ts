// Physical book used by the 3D cover in the hero.
// Current values are estimates for the Rowohlt paperback (256 pages). Replace them with real measurements;
// the 3D model scales from these numbers automatically.
import type { ImageMetadata } from 'astro';

export const book: {
  widthMm: number;
  heightMm: number;
  depthMm: number;
  finish: 'matte' | 'gloss';
  /** Optional straight-on photo of the spine (e.g. import spine from '../assets/book-spine.jpg'). */
  spine?: ImageMetadata;
  /** Optional photo of the back cover. */
  back?: ImageMetadata;
} = {
  widthMm: 125,
  heightMm: 190,
  depthMm: 20,
  finish: 'matte',
};
