import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '@/types/contact';

const CONTACTS_KEY = 'contacts';
const LAST_FETCH_KEY = 'contacts_last_fetch';

const BLOGS_KEY = 'blogs';
const BLOGS_LAST_FETCH_KEY = 'blogs_last_fetch';

export const saveContacts = async (contacts: Contact[]) => {
  try {
    await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    await AsyncStorage.setItem(LAST_FETCH_KEY, Date.now().toString());
  } catch (e) {
    console.error('Error saving contacts:', e);
  }
};

export const getStoredContacts = async (): Promise<Contact[]> => {
  try {
    const contacts = await AsyncStorage.getItem(CONTACTS_KEY);
    return contacts ? JSON.parse(contacts) : [];
  } catch (e) {
    console.error('Error getting contacts:', e);
    return [];
  }
};

export const shouldRefetchContacts = async (): Promise<boolean> => {
  try {
    const lastFetch = await AsyncStorage.getItem(LAST_FETCH_KEY);
    if (!lastFetch) return true;

    const lastFetchDate = new Date(parseInt(lastFetch));
    const now = new Date();
    
    // Refetch if last fetch was more than 24 hours ago
    return now.getTime() - lastFetchDate.getTime() > 24 * 60 * 60 * 1000;
  } catch (e) {
    console.error('Error checking refetch:', e);
    return true;
  }
};

export const saveBlogs = async (blogs: any[]) => {
  try {
    await AsyncStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
    await AsyncStorage.setItem(BLOGS_LAST_FETCH_KEY, Date.now().toString());
  } catch (e) {
    console.error('Error saving blogs:', e);
  }
};

export const getStoredBlogs = async () => {
  try {
    const blogs = await AsyncStorage.getItem(BLOGS_KEY);
    return blogs ? JSON.parse(blogs) : [];
  } catch (e) {
    console.error('Error getting blogs:', e);
    return [];
  }
};

export const shouldRefetchBlogs = async (): Promise<boolean> => {
  try {
    const lastFetch = await AsyncStorage.getItem(BLOGS_LAST_FETCH_KEY);
    if (!lastFetch) return true;

    const lastFetchDate = new Date(parseInt(lastFetch));
    const now = new Date();
    
    // Refetch if last fetch was more than 1 hour ago
    return now.getTime() - lastFetchDate.getTime() > 60 * 60 * 1000;
  } catch (e) {
    console.error('Error checking blog refetch:', e);
    return true;
  }
};
