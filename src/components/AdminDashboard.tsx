import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, Trash2, LogOut, Image as ImageIcon, Video, Mail, MessageSquare, CheckCircle2, FolderPlus, Tag, X, FileUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useGallery } from './GalleryContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { galleryItems, addGalleryItem, removeGalleryItem, categories, addCategory, removeCategory, contactSubmissions, markAsRead, deleteContactSubmission, logout, userEmail } = useGallery();
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteContactId, setDeleteContactId] = useState<number | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = contactSubmissions.filter(sub => !sub.isRead).length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (file) {
      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        toast.error('File size exceeds 50MB limit');
        return;
      }

      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      
      if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP) or video (MP4, WebM, OGG, MOV)');
        return;
      }

      setUploadFile(file);
      const url = URL.createObjectURL(file);
      setUploadUrl('');
      setPreviewUrl(url);
      
      // Detect file type
      if (file.type.startsWith('video/')) {
        setUploadType('video');
      } else {
        setUploadType('image');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleUrlChange = (url: string) => {
    setUploadUrl(url);
    setUploadFile(null);
    if (url) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadFile && !uploadUrl) {
      toast.error('Please upload a file or provide a URL');
      return;
    }

    if (!uploadAlt) {
      toast.error('Please provide a description');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      await addGalleryItem(uploadFile, uploadUrl, uploadAlt, uploadType, selectedCategoryId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        toast.success(`${uploadType === 'video' ? 'Video' : 'Image'} uploaded successfully`);
        setUploadUrl('');
        setUploadAlt('');
        setPreviewUrl('');
        setUploadType('image');
        setSelectedCategoryId(null);
        setUploadFile(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        await removeGalleryItem(deleteId);
        toast.success('Item deleted successfully');
        setDeleteId(null);
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete item');
      }
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      toast.success('Marked as read');
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark as read');
    }
  };

  const handleDeleteContact = (id: number) => {
    setDeleteContactId(id);
  };

  const confirmDeleteContact = async () => {
    if (deleteContactId !== null) {
      try {
        await deleteContactSubmission(deleteContactId);
        toast.success('Contact submission deleted');
        setDeleteContactId(null);
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete contact');
      }
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    
    try {
      await addCategory(newCategoryName.trim());
      toast.success('Category created successfully');
      setNewCategoryName('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create category');
    }
  };

  const handleDeleteCategory = (id: number) => {
    setDeleteCategoryId(id);
  };

  const confirmDeleteCategory = async () => {
    if (deleteCategoryId !== null) {
      try {
        await removeCategory(deleteCategoryId);
        toast.success('Category deleted successfully');
        setDeleteCategoryId(null);
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete category');
      }
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-black text-white py-4 sm:py-6 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="tracking-wider text-xl sm:text-2xl">ADMIN DASHBOARD</h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs w-fit">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Cloud Storage Active
                </span>
                {userEmail && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs w-fit">
                    {userEmail}
                  </span>
                )}
              </div>
              <p className="text-white/60 text-sm mt-1">Manage your portfolio gallery</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto"
            >
              <LogOut className="mr-2" size={18} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="mb-6 sm:mb-8 w-full sm:w-auto grid grid-cols-1 sm:grid-cols-3 h-auto gap-2 sm:gap-0 bg-transparent sm:bg-muted p-0 sm:p-1">
            <TabsTrigger value="gallery" className="w-full sm:w-auto">
              <span className="hidden sm:inline">Gallery Management</span>
              <span className="sm:hidden">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="w-full sm:w-auto">
              <span className="hidden sm:inline">Manage Categories</span>
              <span className="sm:hidden">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="relative w-full sm:w-auto">
              <span className="hidden sm:inline">Contact Submissions</span>
              <span className="sm:hidden">Contacts</span>
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500 hover:bg-red-600">{unreadCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:sticky lg:top-6"
            >
              <h3 className="mb-4 sm:mb-6 flex items-center gap-2 text-lg sm:text-xl">
                <Upload size={20} className="sm:w-6 sm:h-6" />
                Upload New Item
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Type Selection */}
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setUploadType('image')}
                      className={`py-3 px-4 rounded-lg border-2 transition-all ${
                        uploadType === 'image'
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <ImageIcon className="mx-auto mb-1" size={20} />
                      <span className="text-sm">Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadType('video')}
                      className={`py-3 px-4 rounded-lg border-2 transition-all ${
                        uploadType === 'video'
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <Video className="mx-auto mb-1" size={20} />
                      <span className="text-sm">Video</span>
                    </button>
                  </div>
                </div>

                {/* Drag & Drop File Upload */}
                <div className="space-y-2">
                  <Label>Upload File</Label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all cursor-pointer ${
                      isDragging
                        ? 'border-black bg-neutral-50'
                        : 'border-neutral-300 hover:border-neutral-400'
                    } ${uploadFile ? 'bg-green-50 border-green-300' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept={uploadType === 'video' ? 'video/*' : 'image/*'}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    {uploadFile ? (
                      <div className="space-y-2">
                        <FileUp className="mx-auto text-green-600" size={32} />
                        <p className="text-sm text-green-800 break-all px-2">{uploadFile.name}</p>
                        <p className="text-xs text-green-600">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadFile(null);
                            setPreviewUrl('');
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="mt-2"
                        >
                          <X size={14} className="mr-1" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto text-neutral-400" size={32} />
                        <p className="text-sm text-neutral-600">
                          <span className="font-medium text-black">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-neutral-500">
                          {uploadType === 'image' ? 'JPEG, PNG, GIF, WebP' : 'MP4, WebM, OGG, MOV'} (Max 50MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="url">Or Enter URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={uploadUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="bg-neutral-50"
                    disabled={!!uploadFile}
                  />
                </div>

                {/* Alt Text */}
                <div className="space-y-2">
                  <Label htmlFor="alt">Description *</Label>
                  <Input
                    id="alt"
                    type="text"
                    placeholder="Beautiful landscape"
                    value={uploadAlt}
                    onChange={(e) => setUploadAlt(e.target.value)}
                    required
                    className="bg-neutral-50"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category (Optional)</Label>
                  <Select
                    value={selectedCategoryId?.toString() || "none"}
                    onValueChange={(value) => setSelectedCategoryId(value === "none" ? null : Number(value))}
                  >
                    <SelectTrigger className="bg-neutral-50">
                      <SelectValue placeholder="No category (shows in All only)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No category (shows in All only)</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-neutral-500">
                    {selectedCategoryId === null 
                      ? "This item will only appear in the 'All' section" 
                      : "This item will appear in the selected category and 'All' section"}
                  </p>
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200">
                      {uploadType === 'image' ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={previewUrl}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {isUploading && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Uploading...</span>
                      <span className="text-black">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-800"
                  size="lg"
                  disabled={isUploading}
                >
                  <Upload className="mr-2" size={18} />
                  {isUploading ? 'Uploading...' : `Upload ${uploadType === 'video' ? 'Video' : 'Image'}`}
                </Button>
              </form>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs sm:text-sm text-green-800">
                  <strong>☁️ Cloud Storage:</strong> All uploads are saved to Supabase cloud storage and will persist permanently.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Gallery Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl">Gallery Items ({galleryItems.length})</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {galleryItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden group relative"
                  >
                    <div className="aspect-square relative overflow-hidden bg-neutral-100">
                      {item.type === 'image' ? (
                        <img
                          src={item.src}
                          alt={item.alt}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <video
                            src={item.src}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Video className="text-white" size={48} />
                          </div>
                        </div>
                      )}
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 sm:group-hover:opacity-100 opacity-100 sm:opacity-0 transition-opacity hover:bg-red-600"
                      >
                        <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </button>

                      {/* Type Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {item.type}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4">
                      <p className="text-sm text-neutral-600 truncate">{item.alt}</p>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-xs text-neutral-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                        {item.categoryId ? (
                          <span className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                            {categories.find(c => c.id === item.categoryId)?.name || 'Unknown'}
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                            Uncategorized
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {galleryItems.length === 0 && (
                <div className="text-center py-12 sm:py-20 bg-white rounded-lg">
                  <ImageIcon className="mx-auto text-neutral-300 mb-4 sm:w-16 sm:h-16" size={48} />
                  <p className="text-neutral-500">No items in gallery yet</p>
                  <p className="text-neutral-400 text-sm mt-2 px-4">Upload your first item to get started</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Create Category Form */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:sticky lg:top-6"
                >
                  <h3 className="mb-4 sm:mb-6 flex items-center gap-2 text-lg sm:text-xl">
                    <FolderPlus size={20} className="sm:w-6 sm:h-6" />
                    Create New Category
                  </h3>

                  <form onSubmit={handleAddCategory} className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        type="text"
                        placeholder="e.g., Nature, Portrait, Urban"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                        className="bg-neutral-50"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-black hover:bg-neutral-800"
                    >
                      <FolderPlus className="mr-2" size={18} />
                      Create Category
                    </Button>
                  </form>

                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs sm:text-sm text-blue-800">
                      <strong>Note:</strong> All new uploads must be assigned to a category. You need at least one category to upload content.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Categories List */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-lg shadow-lg p-4 sm:p-6"
                >
                  <h3 className="mb-4 sm:mb-6 text-lg sm:text-xl">All Categories ({categories.length})</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {categories.map((category, index) => {
                      const itemCount = galleryItems.filter(item => item.categoryId === category.id).length;
                      return (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="bg-neutral-50 rounded-lg p-4 sm:p-6 border-2 border-neutral-200 hover:border-neutral-300 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Tag className="text-neutral-600 flex-shrink-0 sm:w-5 sm:h-5" size={18} />
                                <h4 className="text-base sm:text-lg truncate">{category.name}</h4>
                              </div>
                              <p className="text-sm text-neutral-500">
                                {itemCount} {itemCount === 1 ? 'item' : 'items'}
                              </p>
                              <p className="text-xs text-neutral-400 mt-1">
                                Created: {new Date(category.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <Button
                              onClick={() => handleDeleteCategory(category.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50 flex-shrink-0"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {categories.length === 0 && (
                    <div className="text-center py-12 sm:py-20">
                      <Tag className="mx-auto text-neutral-300 mb-4 sm:w-16 sm:h-16" size={48} />
                      <p className="text-neutral-500">No categories yet</p>
                      <p className="text-neutral-400 text-sm mt-2 px-4">
                        Create your first category to organize your gallery
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contacts">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl">Contact Submissions ({contactSubmissions.length})</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-red-100 text-red-700 w-fit">
                    {unreadCount} Unread
                  </Badge>
                )}
              </div>

              {contactSubmissions.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {contactSubmissions.map((submission, index) => (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`bg-white rounded-lg shadow-md p-4 sm:p-6 ${
                        !submission.isRead ? 'border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                        <div className="flex-1 w-full min-w-0">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                            <h4 className="text-base sm:text-lg truncate">{submission.name}</h4>
                            {!submission.isRead && (
                              <Badge className="bg-blue-500">New</Badge>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-neutral-600">
                            <div className="flex items-center gap-1">
                              <Mail size={14} className="flex-shrink-0" />
                              <a
                                href={`mailto:${submission.email}`}
                                className="hover:text-black transition-colors truncate"
                              >
                                {submission.email}
                              </a>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <span className="text-xs sm:text-sm">{new Date(submission.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          {!submission.isRead && (
                            <Button
                              onClick={() => handleMarkAsRead(submission.id)}
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50 flex-1 sm:flex-none"
                            >
                              <CheckCircle2 size={16} className="mr-1" />
                              <span className="hidden sm:inline">Mark Read</span>
                              <span className="sm:hidden">Read</span>
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDeleteContact(submission.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-neutral-50 rounded-lg p-3 sm:p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <MessageSquare size={16} className="text-neutral-500 mt-1 flex-shrink-0" />
                          <span className="text-sm text-neutral-600">Message:</span>
                        </div>
                        <p className="text-neutral-800 whitespace-pre-wrap text-sm sm:text-base">{submission.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 sm:py-20 bg-white rounded-lg">
                  <Mail className="mx-auto text-neutral-300 mb-4 sm:w-16 sm:h-16" size={48} />
                  <p className="text-neutral-500">No contact submissions yet</p>
                  <p className="text-neutral-400 text-sm mt-2 px-4">
                    Messages from the contact form will appear here
                  </p>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Gallery Item Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item from your gallery and cloud storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Contact Submission Confirmation Dialog */}
      <AlertDialog open={deleteContactId !== null} onOpenChange={() => setDeleteContactId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete contact submission?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this contact submission from cloud storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteContact} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Category Confirmation Dialog */}
      <AlertDialog open={deleteCategoryId !== null} onOpenChange={() => setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. {categories.length > 1 ? 'All items in this category will be moved to the first available category.' : 'All items in this category will become uncategorized.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
