export interface SearchReq {
  term: string;
  specific: boolean;
}

export interface SearchResult {
  store: string;
  name:  string;
  image: string;
  price: number | string;
  url:   string;
}

export interface SearchResponse {
  isGeneric:   boolean;
  suggestions: string[];
  results:     SearchResult[];
  message:     string;
}

