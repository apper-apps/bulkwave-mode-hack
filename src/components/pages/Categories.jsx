import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { categoryService } from '@/services/api/categoryService';
import { recipientService } from '@/services/api/recipientService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#25D366',
    recipientIds: []
  });

  const colorOptions = [
    { value: '#25D366', label: 'WhatsApp Green' },
    { value: '#3B82F6', label: 'Blue' },
    { value: '#EF4444', label: 'Red' },
    { value: '#F59E0B', label: 'Yellow' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#10B981', label: 'Emerald' },
    { value: '#F97316', label: 'Orange' },
    { value: '#EC4899', label: 'Pink' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [categoriesData, recipientsData] = await Promise.all([
        categoryService.getAll(),
        recipientService.getAll()
      ]);
      setCategories(categoriesData);
      setRecipients(recipientsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      const created = await categoryService.create(newCategory);
      setCategories([...categories, created]);
      setNewCategory({ name: '', color: '#25D366', recipientIds: [] });
      setShowCreateForm(false);
      toast.success('Category created successfully');
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      const updated = await categoryService.update(editingCategory.Id, editingCategory);
      setCategories(categories.map(c => c.Id === updated.Id ? updated : c));
      setEditingCategory(null);
      toast.success('Category updated successfully');
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoryService.delete(categoryId);
      setCategories(categories.filter(c => c.Id !== categoryId));
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const toggleRecipientInCategory = (recipientId, category) => {
    const updatedRecipientIds = category.recipientIds.includes(recipientId)
      ? category.recipientIds.filter(id => id !== recipientId)
      : [...category.recipientIds, recipientId];

    if (editingCategory && editingCategory.Id === category.Id) {
      setEditingCategory({ ...editingCategory, recipientIds: updatedRecipientIds });
    } else {
      const updatedCategory = { ...category, recipientIds: updatedRecipientIds };
      categoryService.update(category.Id, updatedCategory).then(() => {
        setCategories(categories.map(c => c.Id === category.Id ? updatedCategory : c));
      });
    }
  };

const getCategoryRecipients = (recipientIds) => {
    return recipients.filter(r => recipientIds.includes(r.Id));
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Organize your recipients into categories for easy bulk messaging</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button 
            icon="Plus" 
            onClick={() => setShowCreateForm(true)}
            disabled={showCreateForm}
          >
            Create Category
          </Button>
        </div>
      </div>

      {/* Create Category Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Category</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Enter category name..."
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex space-x-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNewCategory({ ...newCategory, color: color.value })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      newCategory.color === color.value ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Recipient Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Recipients
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              <div className="space-y-2">
                {recipients.map((recipient) => (
                  <label key={recipient.Id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCategory.recipientIds.includes(recipient.Id)}
                      onChange={() => {
                        const updatedIds = newCategory.recipientIds.includes(recipient.Id)
                          ? newCategory.recipientIds.filter(id => id !== recipient.Id)
                          : [...newCategory.recipientIds, recipient.Id];
                        setNewCategory({ ...newCategory, recipientIds: updatedIds });
                      }}
                      className="rounded text-whatsapp-500 focus:ring-whatsapp-500"
                    />
                    <div className="flex items-center space-x-2">
                      <ApperIcon 
                        name={recipient.type === 'group' ? 'Users' : recipient.type === 'community' ? 'Building' : 'User'} 
                        className="w-4 h-4 text-gray-500" 
/>
                      <span className="text-sm text-gray-900">{recipient.Name}</span>
                      <Badge variant="default" size="sm">{recipient.type}</Badge>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleCreateCategory}>
              Create Category
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowCreateForm(false);
                setNewCategory({ name: '', color: '#25D366', recipientIds: [] });
              }}
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <Empty 
          title="No categories yet"
          description="Create your first category to organize recipients for bulk messaging."
          action={() => setShowCreateForm(true)}
          actionText="Create Category"
          icon="FolderOpen"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              {editingCategory && editingCategory.Id === category.Id ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <Input
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    placeholder="Category name..."
                  />
                  
                  <div className="flex space-x-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setEditingCategory({ ...editingCategory, color: color.value })}
                        className={`w-6 h-6 rounded-full border ${
                          editingCategory.color === color.value ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>

                  <div className="max-h-32 overflow-y-auto">
                    <div className="space-y-1">
                      {recipients.map((recipient) => (
                        <label key={recipient.Id} className="flex items-center space-x-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingCategory.recipientIds.includes(recipient.Id)}
                            onChange={() => toggleRecipientInCategory(recipient.Id, editingCategory)}
                            className="rounded text-whatsapp-500 focus:ring-whatsapp-500"
/>
                          <span>{recipient.Name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleUpdateCategory}>
                      Save
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditingCategory(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <h3 className="font-semibold text-gray-900">{category.Name}</h3>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ApperIcon name="Edit2" className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.Id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
<div className="mb-4">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {category.recipient_ids.length}
                    </div>
                    <div className="text-sm text-gray-500">Recipients</div>
                  </div>

<div className="space-y-2">
                    {getCategoryRecipients(category.recipient_ids).slice(0, 3).map((recipient) => (
                      <div key={recipient.Id} className="flex items-center space-x-2 text-sm">
                        <ApperIcon 
                          name={recipient.type === 'group' ? 'Users' : recipient.type === 'community' ? 'Building' : 'User'} 
                          className="w-4 h-4 text-gray-500" 
                        />
                        <span className="text-gray-900 truncate">{recipient.Name}</span>
                      </div>
                    ))}
{category.recipient_ids.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{category.recipient_ids.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;