import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_URL, wp_url } from "@/config";

async function getAuthToken() {
  return await AsyncStorage.getItem('token');
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export const api = {
  async get(endpoint: string, requiresAuth = true) {
    const token = requiresAuth ? await getAuthToken() : null;
    const hasQueryParams = endpoint.includes('?');
    const url = `${AUTH_URL}${endpoint}${token ? `${hasQueryParams ? '&' : '?'}token=${token}` : ''}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  async post(endpoint: string, data: any, requiresAuth = true) {
    const token = requiresAuth ? await getAuthToken() : null;
    const url = `${AUTH_URL}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async wpGet(endpoint: string) {
    const url = `${wp_url}/wp-json/wp/v2${endpoint}`;
    const response = await fetch(url);
    return handleResponse(response);
  },
};
