import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
let accessToken: string | null = null;

const getCachedAccessToken = async (): Promise<string | null> => {
  if (accessToken) return accessToken;

  // @ts-ignore: window.electronAPI is injected via preload
  const stored = await window.electronAPI.getAccessToken();
  if (stored) {
    accessToken = stored;
    return stored;
  }

  return null;
};

const getAccessToken = async (publicToken: string): Promise<string> => {
  if (accessToken) return accessToken;

  const stored = await getCachedAccessToken();
  if (stored) return stored;

  const response = await axios.post(
    `${backendUrl}/api/plaid/exchange-public-token`,
    {
      public_token: publicToken,
    }
  );

  const newAccessToken = response.data.access_token;

  accessToken = newAccessToken;

  // @ts-ignore
  await window.electronAPI.saveAccessToken(newAccessToken);

  return newAccessToken;
};

const clearAccessToken = async () => {
  // @ts-ignore
  await window.electronAPI.clearAccessToken();
  accessToken = null;
};

export default {
  getAccessToken,
  getCachedAccessToken,
  clearAccessToken,
};
