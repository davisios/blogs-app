export interface AlgoliaSearchResponse {
  hits: Array<AlgoliaBlog>;
  nbHits: number;
}

export interface AlgoliaBlog {
  created_at: string;
  title: string;
  author: string;
  points: number;
  num_comments: number;
  objectID: string;
  _highlightResult: {
    story_text: {
      value: string;
    };
  };
}
