export type UserType = keyof typeof UserTypes | null;

export enum UserTypes {
  Solicitor = "Solicitor",
  Client = "Client",
}

export interface JobPost {
  _id: string;
  title: string;
  description: string;
  started: boolean;
  feeStructure: "fixedFee" | "noWinNoFee";
  paid: boolean;
  paidAmount: number;
}
