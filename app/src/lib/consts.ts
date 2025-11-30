export const LEPORELLO_BG = 'BG0005LE';

export type OpenLightboxEvent = {
  gallery: string | null;
  index?: number;
  src: string;
  caption: string;
}