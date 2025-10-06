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
  dimensions: {
    type: 'height' | 'width' | 'depth' | string; // allow other dimension types if possible
    value: string; // could be string or number depending on usage
  }[];
  taxonomy: number[] | Work_Taxonomy[] | null;
  series: number[] | Work_Series[] | null;
  medium_category: number[] | Work_Medium[] | null;
  primary_view: string | DirectusFileStub;
  presentations: number[];
  views: string[];
};

interface Work_Taxonomy {
  id: number;
  taxonomy_id: number | Taxonomy;
  work_id: number | Work;
}

interface Work_Series {
  id: number;
  work_id: number | Work;
  series_id: number | Series;
}

interface Work_Medium {
  id: number;
  work_id: number | Work;
  medium_id: number | Medium;
}

export interface Taxonomy {
  id: number;
  title: string;
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

export interface DirectusFileStub {
  id: string;
  width: number;
  height: number;
}

export interface Schema {
  works: Work[]
  taxonomy: Taxonomy[]
  works_taxonomy: Work_Taxonomy[]
  series: Series[]
  works_series: Work_Series[]
  medium: Medium[]
  works_medium: Work_Medium[]
  works_primary_view: DirectusFileStub
  // works_files: Work_File[]
}