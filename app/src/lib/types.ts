export type Schema = {
  works: Work[]
}

export type Work = {
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
  primary_view: string;
  presentations: number[];
  views: string[];
};