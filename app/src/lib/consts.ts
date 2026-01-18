export const LEPORELLO_BG = 'BG0005LE';

export type OpenLightboxEvent = {
  gallery: string | null;
  index?: number;
  src: string;
  caption: string;
}

export type AssetRequest = {
  id: string;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'inside' | 'outside';
}