import { type Athlete } from './athletes';

// Use same-origin by default
const API_BASE = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

// Athlete API functions
export async function fetchAthletes(): Promise<Athlete[]> {
  try {
    const response = await fetch(`${API_BASE}/api/athletes`, {
      cache: 'no-store', // Always get fresh data
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching athletes:', error);
    // Return empty array on error - components should handle gracefully
    return [];
  }
}

export async function fetchAthlete(slug: string): Promise<Athlete | null> {
  try {
    const response = await fetch(`${API_BASE}/api/athletes/${slug}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching athlete:', error);
    return null;
  }
}

export async function createAthlete(athlete: Athlete): Promise<Athlete | null> {
  try {
    console.log('Frontend: Creating athlete with data:', JSON.stringify(athlete, null, 2));
    console.log('Frontend: API_BASE is:', API_BASE);
    
    const response = await fetch(`${API_BASE}/api/athletes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(athlete),
    });
    
    console.log('Frontend: Response status:', response.status);
    console.log('Frontend: Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Frontend: Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Frontend: Success response:', result);
    return result;
  } catch (error) {
    console.error('Frontend: Error creating athlete:', error);
    return null;
  }
}

export async function updateAthlete(slug: string, athlete: Athlete): Promise<Athlete | null> {
  try {
    const response = await fetch(`${API_BASE}/api/athletes/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(athlete),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating athlete:', error);
    return null;
  }
}

export async function deleteAthlete(slug: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/athletes/${slug}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting athlete:', error);
    return false;
  }
}

export async function updateAllAthletes(athletes: Athlete[]): Promise<Athlete[] | null> {
  try {
    const response = await fetch(`${API_BASE}/api/athletes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(athletes),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating all athletes:', error);
    return null;
  }
}

// Product API functions
export async function fetchProducts(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE}/api/products`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function apiCreateProduct(product: any): Promise<any | null> {
  try {
    console.log('Frontend: Creating product with data:', JSON.stringify(product, null, 2));
    console.log('Frontend: API_BASE is:', API_BASE);

    const response = await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    console.log('Frontend: Response status:', response.status);
    console.log('Frontend: Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Frontend: Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    console.log('Frontend: Success response:', result);
    return result;
  } catch (error) {
    console.error('Frontend: Error creating product:', error);
    return null;
  }
}

export async function apiUpdateProduct(id: string, product: any): Promise<any | null> {
  try {
    console.log('Frontend: Updating product with data:', JSON.stringify(product, null, 2));
    console.log('Frontend: API_BASE is:', API_BASE);
    console.log('Frontend: Product ID:', id);

    const response = await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    
    console.log('Frontend: Response status:', response.status);
    console.log('Frontend: Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Frontend: Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Frontend: Success response:', result);
    return result;
  } catch (error) {
    console.error('Frontend: Error updating product:', error);
    return null;
  }
}

export async function apiDeleteProduct(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

