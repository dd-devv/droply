export interface RegUsersReq {
  startDate: Date;
  endDate:   Date;
}

export interface RegUsers {
  message: string;
  data:    DataRegs[];
}

export interface DataRegs {
  fecha:    Date;
  cantidad: number;
}

export interface UserByAdmin {
  onlyHisLow:   boolean;
  _id:          string;
  fullname:     string;
  whatsapp:     string;
  urls_scrap:   number;
  verified:     boolean;
  code:         null;
  scrapingJobs: any[];
  createdAt:    Date;
  updatedAt:    Date;
  __v:          number;
  email:        null;
  role:         string;
}
