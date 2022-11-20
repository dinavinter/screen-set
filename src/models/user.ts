export enum DefaultPrivacyLevel {
  public = "public",
  private = "private",
  contacts = "contacts",
}

export interface IdToken {
  raw: string
  details : any
}
export interface User {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  photo: string;
  phoneNumber: string;
  balance: number;
  avatar: string;
  defaultPrivacyLevel: DefaultPrivacyLevel;
  createdAt: Date;
  modifiedAt: Date;
}

export type UserSettingsPayload = Pick<
  User,
  "firstName" | "lastName" | "email" | "phoneNumber" | "defaultPrivacyLevel"
>;

 