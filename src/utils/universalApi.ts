/**
 * Universal API Client
 * Automatically routes requests to MockAPI or LightAPI based on configuration
 */

import { api } from './api';
import mockApi from 'src/@mock-utils/mockApi';
import { getProviderConfig, TableName, getCurrentProvider } from '@/config/dataProvider';

export interface UniversalApiOptions {
  queryParams?: Record<string, unknown>;
}

export interface CreateOptions<T> extends UniversalApiOptions {
  data: T;
}

export interface UpdateOptions<T> extends UniversalApiOptions {
  id: string;
  data: T;
}

export interface DeleteOptions extends UniversalApiOptions {
  ids: string[];
}

export interface FindOptions extends UniversalApiOptions {
  param: string | Record<string, unknown>;
}

export interface FindAllOptions extends UniversalApiOptions {
  queryParams?: Record<string, unknown>;
}

/**
 * Universal API client that switches between Mock and Light API
 */
export class UniversalApi {
  constructor(private tableName: TableName) {}

  private getConfig() {
    return getProviderConfig(this.tableName);
  }

  private async callLightApi<T>(method: string, endpoint: string, body?: any): Promise<T> {
    const config = this.getConfig();
    const url = `${config.baseUrl}/${config.lightApiTable}${endpoint}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`LightAPI request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  private async callMockApi<T>(operation: string, ...args: any[]): Promise<T> {
    const config = this.getConfig();
    const mockApiClient = mockApi(config.mockApiTable);
    return await mockApiClient[operation](...args);
  }

  async create<T extends { id?: string }>(data: T): Promise<T> {
    const provider = getCurrentProvider();
    
    if (provider.isLight) {
      return await this.callLightApi('POST', '', data);
    } else {
      return await this.callMockApi<T>('create', data);
    }
  }

  async delete(ids: string[]): Promise<{ success: boolean }> {
    const provider = getCurrentProvider();
    
    if (provider.isLight) {
      // LightAPI doesn't have bulk delete, so delete one by one
      for (const id of ids) {
        await this.callLightApi('DELETE', `/${id}`);
      }
      return { success: true };
    } else {
      return await this.callMockApi<{ success: boolean }>('delete', ids);
    }
  }

  async update<T>(id: string, updatedData: Record<string, unknown>): Promise<T | null> {
    const provider = getCurrentProvider();
    
    if (provider.isLight) {
      return await this.callLightApi<T>('PUT', `/${id}`, updatedData);
    } else {
      return await this.callMockApi<T | null>('update', id, updatedData);
    }
  }

  async updateMany<T extends { id: string }>(items: T[]): Promise<T[]> {
    const provider = getCurrentProvider();
    
    if (provider.isLight) {
      // LightAPI doesn't have updateMany, so update one by one
      const results: T[] = [];
      for (const item of items) {
        const result = await this.callLightApi<T>('PUT', `/${item.id}`, item);
        results.push(result);
      }
      return results;
    } else {
      return await this.callMockApi<T[]>('updateMany', items);
    }
  }

  async find<T extends { id?: string }>(param: string | Record<string, unknown>): Promise<T | null> {
    const provider = getCurrentProvider();
    
    if (provider.isLight) {
      if (typeof param === 'string') {
        // Find by ID
        try {
          return await this.callLightApi<T>('GET', `/${param}`);
        } catch (error) {
          return null;
        }
      } else {
        // LightAPI doesn't support complex queries via GET, fallback to findAll and filter
        const allItems = await this.findAll<T>({});
        return allItems.find((item) => 
          Object.entries(param).every(([key, value]) => item[key] === value)
        ) || null;
      }
    } else {
      return await this.callMockApi<T | null>('find', param);
    }
  }

  async findAll<T>(queryParams: Record<string, unknown> = {}): Promise<T[]> {
    const provider = getCurrentProvider();
    
    if (provider.isLight) {
      const query = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      });
      
      const queryString = query.toString();
      const endpoint = queryString ? `?${queryString}` : '';
      
      return await this.callLightApi<T[]>('GET', endpoint);
    } else {
      return await this.callMockApi<T[]>('findAll', queryParams);
    }
  }

  // LightAPI specific methods
  async search<T>(query: string): Promise<T[]> {
    const provider = getCurrentProvider();
    
    if (provider.isLight) {
      return await this.callLightApi<T[]>('GET', `/search/${encodeURIComponent(query)}`);
    } else {
      // Fallback: get all and filter manually for MockAPI
      const allItems = await this.findAll<T>({});
      const queryLower = query.toLowerCase();
      return allItems.filter(item => 
        JSON.stringify(item).toLowerCase().includes(queryLower)
      );
    }
  }

  async count(): Promise<number> {
    const provider = getCurrentProvider();
    
    if (provider.isLight) {
      const result = await this.callLightApi<{ count: number }>('GET', '/count');
      return result.count;
    } else {
      // MockAPI doesn't have count, so get all and count
      const items = await this.findAll({});
      return items.length;
    }
  }

  async batchCreate<T>(items: T[]): Promise<{ message: string }> {
    const provider = getCurrentProvider();
    
    if (provider.isLight) {
      return await this.callLightApi('POST', '/batch', { items });
    } else {
      // MockAPI doesn't have batch create, create one by one
      for (const item of items) {
        await this.create(item as T & { id?: string });
      }
      return { message: `${items.length} records created successfully` };
    }
  }
}

/**
 * Factory function to create a universal API client for a table
 */
export const universalApi = (tableName: TableName) => new UniversalApi(tableName);

/**
 * Hook for React components to get current provider info
 */
export const useDataProvider = () => {
  return getCurrentProvider();
};