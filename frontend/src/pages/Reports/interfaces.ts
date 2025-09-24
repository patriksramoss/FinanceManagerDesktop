export interface Transaction {
  name: string;
  amount: number;
  date: string;
}

export interface PlaidSuccessMetadata {
  public_token: string;
  metadata: {
    institution: string;
    account_id: string;
  };
}

export interface Error {
  message: string;
}
