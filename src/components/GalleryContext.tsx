import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';

export interface Category {
  id: number;
  name: string;
  createdAt: number;
}

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  type: 'image' | 'video';
  categoryId: number | null;
  createdAt: number;
  storagePath?: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: number;
  isRead: boolean;
}

interface GalleryContextType {
  galleryItems: GalleryItem[];
  addGalleryItem: (file: File | null, url: string, alt: string, type: 'image' | 'video', categoryId: number | null) => Promise<void>;
  removeGalleryItem: (id: number) => Promise<void>;
  categories: Category[];
  addCategory: (name: string) => Promise<void>;
  removeCategory: (id: number) => Promise<void>;
  contactSubmissions: ContactSubmission[];
  addContactSubmission: (submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  deleteContactSubmission: (id: number) => Promise<void>;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshGallery: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshContacts: () => Promise<void>;
  userEmail: string | null;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-71a82940`;

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Check auth status on mount and set up auth listener
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAdmin(true);
        setUserEmail(session.user.email || null);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAdmin(true);
        setUserEmail(session.user.email || null);
      } else {
        setIsAdmin(false);
        setUserEmail(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch gallery items from server
  const fetchGalleryItems = async () => {
    try {
      const response = await fetch(`${API_BASE}/gallery`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch gallery items. Status:', response.status, 'Error:', errorText);
        throw new Error('Failed to fetch gallery items');
      }

      const data = await response.json();
      setGalleryItems(data.items || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    }
  };

  // Fetch categories from server
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch contact submissions from server
  const fetchContactSubmissions = async () => {
    try {
      const response = await fetch(`${API_BASE}/contacts`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contact submissions');
      }

      const data = await response.json();
      setContactSubmissions(data.contacts || []);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
    }
  };

  // Load all data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchGalleryItems(),
        fetchCategories(),
        fetchContactSubmissions(),
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const addGalleryItem = async (file: File | null, url: string, alt: string, type: 'image' | 'video', categoryId: number | null) => {
    try {
      const formData = new FormData();
      
      if (file) {
        formData.append('file', file);
      } else if (url) {
        formData.append('url', url);
      } else {
        throw new Error('Either file or URL is required');
      }
      
      formData.append('alt', alt);
      formData.append('type', type);
      if (categoryId !== null) {
        formData.append('categoryId', categoryId.toString());
      }

      const response = await fetch(`${API_BASE}/gallery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add gallery item');
      }

      await fetchGalleryItems(); // Refresh gallery items
    } catch (error) {
      console.error('Error adding gallery item:', error);
      throw error;
    }
  };

  const removeGalleryItem = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete gallery item');
      }

      await fetchGalleryItems(); // Refresh gallery items
    } catch (error) {
      console.error('Error removing gallery item:', error);
      throw error;
    }
  };

  const addCategory = async (name: string) => {
    try {
      const response = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create category');
      }

      await fetchCategories(); // Refresh categories
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const removeCategory = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }

      await fetchCategories(); // Refresh categories
      await fetchGalleryItems(); // Refresh gallery items to update reassigned items
    } catch (error) {
      console.error('Error removing category:', error);
      throw error;
    }
  };

  const addContactSubmission = async (submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'isRead'>) => {
    try {
      const response = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create contact submission');
      }

      await fetchContactSubmissions(); // Refresh contacts
    } catch (error) {
      console.error('Error adding contact submission:', error);
      throw error;
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/contacts/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mark contact as read');
      }

      await fetchContactSubmissions(); // Refresh contacts
    } catch (error) {
      console.error('Error marking contact as read:', error);
      throw error;
    }
  };

  const deleteContactSubmission = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete contact submission');
      }

      await fetchContactSubmissions(); // Refresh contacts
    } catch (error) {
      console.error('Error deleting contact submission:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setIsAdmin(true);
        setUserEmail(data.user.email || null);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUserEmail(null);
  };

  return (
    <GalleryContext.Provider
      value={{
        galleryItems,
        addGalleryItem,
        removeGalleryItem,
        categories,
        addCategory,
        removeCategory,
        contactSubmissions,
        addContactSubmission,
        markAsRead,
        deleteContactSubmission,
        isAdmin,
        login,
        logout,
        isLoading,
        refreshGallery: fetchGalleryItems,
        refreshCategories: fetchCategories,
        refreshContacts: fetchContactSubmissions,
        userEmail,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within GalleryProvider');
  }
  return context;
}
