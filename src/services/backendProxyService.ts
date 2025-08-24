// src/services/backendProxyService.ts
import { InstagramPost } from '../components/PostCard';

export class BackendProxyService {
  private apiUrl: string;

  constructor(apiUrl: string = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001') {
    this.apiUrl = apiUrl;
  }

  async searchByHashtag(hashtag: string): Promise<InstagramPost[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/instagram/hashtag/${encodeURIComponent(hashtag)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transformar si es necesario
      return data.posts || data;
    } catch (error) {
      console.error('Backend proxy error:', error);
      throw error;
    }
  }

  async searchByLocation(latitude: number, longitude: number): Promise<InstagramPost[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/instagram/location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.posts || data;
    } catch (error) {
      console.error('Location search error:', error);
      throw error;
    }
  }
}

// Ejemplo de backend en Node.js con Express
/*
// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Usando una librería como instagram-web-api o similar
app.get('/api/instagram/hashtag/:hashtag', async (req, res) => {
  try {
    const { hashtag } = req.params;
    
    // Aquí implementarías la lógica real para obtener datos
    // Podrías usar servicios como:
    // - RapidAPI Instagram APIs
    // - Apify Instagram scrapers
    // - Instagram-web-api
    
    const posts = await fetchInstagramHashtag(hashtag);
    
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Backend proxy running on port 3001');
});
*/