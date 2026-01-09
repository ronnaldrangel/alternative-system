import axios from 'axios';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const strapi = axios.create({
  baseURL: STRAPI_URL,
});

export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await strapi.post('/api/auth/local/register', {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || { message: 'An error occurred during registration' };
  }
};

export const loginUser = async (identifier: string, password: string) => {
  try {
    const response = await strapi.post('/api/auth/local', {
      identifier,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || { message: 'An error occurred during login' };
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await strapi.post('/api/auth/forgot-password', {
      email,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || { message: 'An error occurred while requesting password reset' };
  }
};

export const getWorkspaces = async (jwt: string) => {
  try {
    const response = await strapi.get('/api/workspaces', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || { message: 'An error occurred while fetching workspaces' };
  }
};

export const createWorkspace = async (name: string, jwt: string) => {
  try {
    const response = await strapi.post('/api/workspaces', {
      data: {
        name,
        slug: name.toLowerCase().replace(/ /g, '-'),
      }
    }, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || { message: 'An error occurred while creating workspace' };
  }
};
