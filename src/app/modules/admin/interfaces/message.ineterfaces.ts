export interface MessageReq {
  message: string;
  images:  string[];
  sendOn:  Date;
}

export interface MessagesRes {
  mensajes:   Mensaje[];
}

export interface Mensaje {
  _id:       string;
  createdBy: CreatedByMessage;
  message:   string;
  images:    string[];
  sendOn:    Date;
  sent:      boolean;
  createdAt: Date;
}

export interface CreatedByMessage {
  _id:      string;
  fullname: string;
  whatsapp: string;
}
