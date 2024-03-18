export interface AlgoliaSearchResponse {
  hits: Array<AlgoliaBlog>;
  nbHits: number;
}

export interface AlgoliaBlog {
  created_at: string;
  title: string;
  author: string;
  objectID: string;
  story_url: string;
  _highlightResult: {
    story_title?: {
      value?: string;
    };
  };
}
