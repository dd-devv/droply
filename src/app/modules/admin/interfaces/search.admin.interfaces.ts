export interface SearchAdminReq {
  startDate: Date;
  endDate:   Date;
}

export interface SearchesRes {
  _id:       string;
  user:      UserSearch | null;
  terms:     Term[];
  __v:       number;
  createdAt: Date;
}

export interface Term {
  term:       string;
  searchDate: Date;
  _id:        string;
}

export interface UserSearch {
  _id:      string;
  fullname: string;
  whatsapp: string;
}

export interface DataSearches {
  date:    Date;
  count: number;
}
