
export enum AppStep {
  TITLE_INPUT = 'TITLE_INPUT',
  TITLE_SELECTION = 'TITLE_SELECTION',
  METADATA_OPTIMIZATION = 'METADATA_OPTIMIZATION',
  THUMBNAIL_EDITOR = 'THUMBNAIL_EDITOR',
}

export interface GeneratedTitle {
  title: string;
}

export interface StyleAttributes {
  palette: string[];
  typography: string;
  layout: string;
  effects: string;
}

export interface ImageData {
  base64: string;
  name: string;
}