export type UserType = keyof typeof UserTypes | null;

export enum UserTypes {
  Solicitor = "Solicitor",
  Client = "Client",
}
