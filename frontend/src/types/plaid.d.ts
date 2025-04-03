// PlaidMetadata and success response types
export interface PlaidLinkOnSuccessMetadata {
  institution: {
    name: string;
    id: string;
  };
  link_session_id: string;
  user_id: string; // Ensure user_id exists in metadata
}

export interface PlaidSuccessResponse {
  public_token: string;
  metadata: PlaidLinkOnSuccessMetadata;
}
