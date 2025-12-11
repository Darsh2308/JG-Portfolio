// @ts-nocheck
// @deno-types="npm:@types/node"
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.47.10";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const bucketName = 'make-71a82940-gallery';

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize storage bucket on server start
(async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket: any) => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
      });
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('Storage bucket created successfully');
      }
    } else {
      console.log('Storage bucket already exists');
    }

    // Cloud storage is ready - no automatic data initialization
    console.log('Cloud storage initialized - ready for admin uploads');
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
})();

// Health check endpoint
app.get("/make-server-71a82940/health", (c: any) => {
  return c.json({ status: "ok" });
});

// ====================
// GALLERY ROUTES
// ====================

// Get all gallery items
app.get("/make-server-71a82940/gallery", async (c: any) => {
  try {
    const items = await kv.getByPrefix('gallery:');
    
    // Create signed URLs for all items
    const itemsWithUrls = await Promise.all(
      items.map(async (item: any) => {
        if (item.storagePath) {
          const { data } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(item.storagePath, 3600); // 1 hour expiry
          
          return {
            ...item,
            src: data?.signedUrl || item.src
          };
        }
        return item;
      })
    );
    
    // Sort by createdAt descending (newest first)
    itemsWithUrls.sort((a, b) => b.createdAt - a.createdAt);
    
    return c.json({ items: itemsWithUrls });
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return c.json({ error: 'Failed to fetch gallery items' }, 500);
  }
});

// Upload new gallery item
app.post("/make-server-71a82940/gallery", async (c: any) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const alt = formData.get('alt') as string;
    const type = formData.get('type') as string;
    const categoryId = formData.get('categoryId') as string;
    const url = formData.get('url') as string;

    if (!alt || !type || !categoryId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const id = Date.now();
    const createdAt = Date.now();
    
    let storagePath = '';
    let src = url || '';

    // If a file was uploaded, save it to Supabase Storage
    if (file) {
      const fileExt = file.name.split('.').pop();
      storagePath = `${id}.${fileExt}`;
      
      const arrayBuffer = await file.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, arrayBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return c.json({ error: 'Failed to upload file' }, 500);
      }

      // Get signed URL
      const { data } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(storagePath, 3600);
      
      src = data?.signedUrl || '';
    }

    const newItem = {
      id,
      src,
      alt,
      type,
      categoryId: Number(categoryId),
      createdAt,
      storagePath,
    };

    await kv.set(`gallery:${id}`, newItem);

    return c.json({ item: newItem });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return c.json({ error: 'Failed to create gallery item' }, 500);
  }
});

// Delete gallery item
app.delete("/make-server-71a82940/gallery/:id", async (c: any) => {
  try {
    const id = c.req.param('id');
    const item = await kv.get(`gallery:${id}`);

    if (!item) {
      return c.json({ error: 'Item not found' }, 404);
    }

    // Delete from storage if it has a storage path
    if (item.storagePath) {
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([item.storagePath]);

      if (deleteError) {
        console.error('Error deleting file from storage:', deleteError);
      }
    }

    await kv.del(`gallery:${id}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return c.json({ error: 'Failed to delete gallery item' }, 500);
  }
});

// ====================
// CATEGORY ROUTES
// ====================

// Get all categories
app.get("/make-server-71a82940/categories", async (c: any) => {
  try {
    const categories = await kv.getByPrefix('category:');
    // Sort by createdAt ascending (oldest first)
    categories.sort((a, b) => a.createdAt - b.createdAt);
    return c.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

// Create new category
app.post("/make-server-71a82940/categories", async (c: any) => {
  try {
    const { name } = await c.req.json();

    if (!name || !name.trim()) {
      return c.json({ error: 'Category name is required' }, 400);
    }

    const id = Date.now();
    const newCategory = {
      id,
      name: name.trim(),
      createdAt: Date.now(),
    };

    await kv.set(`category:${id}`, newCategory);

    return c.json({ category: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    return c.json({ error: 'Failed to create category' }, 500);
  }
});

// Delete category
app.delete("/make-server-71a82940/categories/:id", async (c: any) => {
  try {
    const id = c.req.param('id');
    const category = await kv.get(`category:${id}`);

    if (!category) {
      return c.json({ error: 'Category not found' }, 404);
    }

    // Set all items in this category to uncategorized (null)
    const allItems = await kv.getByPrefix('gallery:');
    const itemsToReassign = allItems.filter(item => item.categoryId === Number(id));

    for (const item of itemsToReassign) {
      await kv.set(`gallery:${item.id}`, {
        ...item,
        categoryId: null, // Set to null (uncategorized - will only show in "All")
      });
    }

    await kv.del(`category:${id}`);

    return c.json({ success: true, reassignedTo: null });
  } catch (error) {
    console.error('Error deleting category:', error);
    return c.json({ error: 'Failed to delete category' }, 500);
  }
});

// ====================
// CONTACT ROUTES
// ====================

// Get all contact submissions
app.get("/make-server-71a82940/contacts", async (c: any) => {
  try {
    const contacts = await kv.getByPrefix('contact:');
    // Sort by createdAt descending (newest first)
    contacts.sort((a, b) => b.createdAt - a.createdAt);
    return c.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return c.json({ error: 'Failed to fetch contacts' }, 500);
  }
});

// Create new contact submission
app.post("/make-server-71a82940/contacts", async (c: any) => {
  try {
    const { name, email, message } = await c.req.json();

    if (!name || !email || !message) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    const id = Date.now();
    const newContact = {
      id,
      name,
      email,
      message,
      createdAt: Date.now(),
      isRead: false,
    };

    await kv.set(`contact:${id}`, newContact);

    return c.json({ contact: newContact });
  } catch (error) {
    console.error('Error creating contact submission:', error);
    return c.json({ error: 'Failed to create contact submission' }, 500);
  }
});

// Mark contact as read
app.patch("/make-server-71a82940/contacts/:id/read", async (c: any) => {
  try {
    const id = c.req.param('id');
    const contact = await kv.get(`contact:${id}`);

    if (!contact) {
      return c.json({ error: 'Contact not found' }, 404);
    }

    const updatedContact = {
      ...contact,
      isRead: true,
    };

    await kv.set(`contact:${id}`, updatedContact);

    return c.json({ contact: updatedContact });
  } catch (error) {
    console.error('Error marking contact as read:', error);
    return c.json({ error: 'Failed to mark contact as read' }, 500);
  }
});

// Delete contact submission
app.delete("/make-server-71a82940/contacts/:id", async (c: any) => {
  try {
    const id = c.req.param('id');
    const contact = await kv.get(`contact:${id}`);

    if (!contact) {
      return c.json({ error: 'Contact not found' }, 404);
    }

    await kv.del(`contact:${id}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return c.json({ error: 'Failed to delete contact' }, 500);
  }
});

Deno.serve(app.fetch);
