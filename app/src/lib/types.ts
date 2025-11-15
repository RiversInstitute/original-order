export interface Work {
  id: number;
  status: 'draft' | 'published';
  date_created: string; // ISO date string
  date_updated: string; // ISO date string
  inventory_id: string;
  year: string;
  description: string | null;
  title: string;
  notes: string | null;
  box_number: string | null;
  medium_description: string | null;
  dimensions?: {
    type: 'height' | 'width' | 'depth' | string; // allow other dimension types if possible
    value: string; // could be string or number depending on usage
  }[];
  taxonomy: number[] | Work_Taxonomy[] | null;
  series: number[] | Work_Series[] | null;
  medium_category: number[] | Work_Medium[] | null;
  primary_view: string | DirectusFileStub;
  presentations: number[];
  views: number[] | Work_File[] | null;
  videos?: {
    title?: string;
    youtube_id: string;
  }[]
};

interface Work_Taxonomy {
  id: number;
  taxonomy_id: number | Taxonomy;
  works_id: number | Work;
}

interface Taxonomy_Work {
  id: number;
  works_id: number | Work;
  taxonomy_id: number | Taxonomy;
}

interface Work_Series {
  id: number;
  works_id: number | Work;
  series_id: number | Series;
}

interface Work_Medium {
  id: number;
  works_id: number | Work;
  medium_id: number | Medium;
}

interface Work_File {
  id: number;
  works_id: number | Work;
  directus_files_id: string | DirectusFileStub;
}


export interface Taxonomy {
  id: number;
  title: string;
  definition_works: number[] | Taxonomy_Work[] | null;
  description: string | null;
}

export interface Series {
  id: number;
  title: string;
  description: string | null;
}

export interface Medium {
  id: number;
  title: string;
  description: string | null;
}

export interface Information {
  title: string;
  content: string;
}

export interface Live {
  videos?: {
    title: string;
    work_id?: { key: number, collection: string };
    youtube_id: string;
  }[]
}

export interface Leporello {
  blocks: LeporelloBlock[]
}

export interface LeporelloBlock {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description?: string;
  url?: string;
  work?: { key: number, collection: string };
}

export interface DirectusFileStub {
  id: string;
  width: number;
  height: number;
  description: string | null;
}
export interface Schema {
  information: Information
  works: Work[]
  taxonomy: Taxonomy[]
  works_taxonomy: Work_Taxonomy[]
  taxonomy_works: Taxonomy_Work[]
  series: Series[]
  works_series: Work_Series[]
  medium: Medium[]
  works_medium: Work_Medium[]
  works_primary_view: DirectusFileStub
  works_views: DirectusFileStub[]
  works_files: Work_File[]
  videos: Live
  leporello: Leporello
}