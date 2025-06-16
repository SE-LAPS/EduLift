// Simple debugging helpers for API calls

export const logApiError = (error: any, prefix: string = 'API Error') => {
  console.error(`${prefix}:`, {
    message: error.message,
    response: error.response ? {
      data: error.response.data,
      status: error.response.status,
      headers: error.response.headers
    } : 'No response',
    config: error.config ? {
      url: error.config.url,
      method: error.config.method,
      data: error.config.data,
      headers: error.config.headers
    } : 'No config'
  });
};

export const logApiRequest = (config: any, prefix: string = 'API Request') => {
  console.log(`${prefix}:`, {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers
  });
};

export const logApiResponse = (response: any, prefix: string = 'API Response') => {
  console.log(`${prefix}:`, {
    data: response.data,
    status: response.status,
    headers: response.headers
  });
}; 