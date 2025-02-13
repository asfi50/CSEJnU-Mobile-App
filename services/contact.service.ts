
import { api } from './api';
import { Contact } from '@/types/contact';

export const contactService = {
  async getContacts(): Promise<Contact[]> {
    return await api.get('/api/contacts');
  },
};