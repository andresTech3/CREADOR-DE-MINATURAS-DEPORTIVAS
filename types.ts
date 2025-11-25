export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT_2_3 = '2:3',
  LANDSCAPE_3_2 = '3:2',
  PORTRAIT_3_4 = '3:4',
  LANDSCAPE_4_3 = '4:3',
  PORTRAIT_9_16 = '9:16',
  LANDSCAPE_16_9 = '16:9',
  CINEMATIC_21_9 = '21:9',
}

export enum ImageResolution {
  RES_1K = '1K',
  RES_2K = '2K',
  RES_4K = '4K',
}

export enum ModelType {
  PRO_IMAGE = 'gemini-3-pro-image-preview',
  FLASH_IMAGE = 'gemini-2.5-flash-image',
}

export enum CompositionType {
  SPLIT_DIAGONAL = 'Diagonal Split',
  FACE_OFF = 'Face to Face',
  DOUBLE_EXPOSURE = 'Double Exposure',
  ACTION_COLLAGE = 'Action Collage',
  CENTER_FOCUS = 'Center Burst',
}

export enum PosterStyle {
  REALISTIC_STADIUM = 'Realistic Stadium',
  CYBERPUNK_NEON = 'Cyberpunk Neon',
  GRUNGE_TEXTURE = 'Urban Grunge',
  BROADCAST_3D = '3D Broadcast',
  ILLUSTRATIVE = 'Comic Illustration',
  GOLD_LUXURY = 'Gold & Luxury',
}

export interface UploadedImage {
  id: string;
  data: string; // base64
  mimeType: string;
  previewUrl: string;
}

export interface GenerationConfig {
  aspectRatio: AspectRatio;
  resolution: ImageResolution;
  prompt: string;
  negativePrompt?: string;
}

export interface GeneratedResult {
  imageUrl: string;
  prompt: string;
  timestamp: number;
}