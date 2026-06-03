// Test file to check API connections
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

console.log('Testing API connections...');
console.log('API_BASE:', API_BASE);

// Test health endpoint
axios.get(`${API_BASE.replace('/api/v1', '')}/health`)
  .then(response => {
    console.log('Health check:', response.data);
  })
  .catch(error => {
    console.error('Health check failed:', error.message);
  });

// Test hotels endpoint
axios.get(`${API_BASE}/hotels?sort=rating_desc&page=1`)
  .then(response => {
    console.log('Hotels API:', response.data);
  })
  .catch(error => {
    console.error('Hotels API failed:', error.message);
  });

// Test auth me endpoint (will fail without token, but shows if endpoint exists)
axios.get(`${API_BASE}/auth/me`)
  .then(response => {
    console.log('Auth me:', response.data);
  })
  .catch(error => {
    console.log('Auth me failed (expected without token):', error.response?.status);
  });

export {};