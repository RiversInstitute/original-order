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
  primary_view: string | DirectusFileStub;
  presentations: number[];
  views: string[];
};

interface Work_Taxonomy {
  id: number;
  taxonomy_id: number | Taxonomy;
  work_id: number | Work;
}

interface Taxonomy {
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
  work_taxonomy: Work_Taxonomy[]
  work_primary_view: DirectusFileStub
  // work_files: Work_File[]
}