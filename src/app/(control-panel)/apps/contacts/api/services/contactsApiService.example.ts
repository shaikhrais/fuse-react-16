/**
 * EXAMPLE: Contacts API Service using Universal API
 * This shows how to migrate from mockApi to universalApi
 */

import { universalApi } from '@/utils/universalApi';
import { Contact } from '../types';

// OLD WAY (MockAPI only):
// import mockApi from 'src/@mock-utils/mockApi';
// const api = mockApi('contacts_items');

// NEW WAY (Universal - supports both MockAPI and LightAPI):
const api = universalApi('contacts');

/**
 * Get all contacts with optional query parameters
 */
export const getContacts = async (queryParams?: Record<string, unknown>): Promise<Contact[]> => {
  return await api.findAll<Contact>(queryParams);
};

/**
 * Get a single contact by ID
 */
export const getContact = async (id: string): Promise<Contact | null> => {
  return await api.find<Contact>(id);
};

/**
 * Create a new contact
 */
export const createContact = async (contactData: Omit<Contact, 'id'>): Promise<Contact> => {
  return await api.create<Contact>(contactData as Contact);
};

/**
 * Update an existing contact
 */
export const updateContact = async (id: string, contactData: Partial<Contact>): Promise<Contact | null> => {
  return await api.update<Contact>(id, contactData);
};

/**
 * Delete contacts by IDs
 */
export const deleteContacts = async (ids: string[]): Promise<{ success: boolean }> => {
  return await api.delete(ids);
};

/**
 * Update multiple contacts at once
 */
export const updateManyContacts = async (contacts: Contact[]): Promise<Contact[]> => {
  return await api.updateMany(contacts);
};

/**
 * Search contacts (LightAPI specific, falls back to manual search for MockAPI)
 */
export const searchContacts = async (query: string): Promise<Contact[]> => {
  return await api.search<Contact>(query);
};

/**
 * Get total count of contacts
 */
export const getContactsCount = async (): Promise<number> => {
  return await api.count();
};

/**
 * Batch create multiple contacts (LightAPI optimized)
 */
export const batchCreateContacts = async (contacts: Contact[]): Promise<{ message: string }> => {
  return await api.batchCreate(contacts);
};