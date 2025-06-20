export interface PlaidLinkOnSuccessMetadata {
  institution: {
    name: string;
    id: string;
  };
  link_session_id: string;
  user_id: string;
}

export interface PlaidSuccessResponse {
  public_token: string;
  metadata: PlaidLinkOnSuccessMetadata;
}
