import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import RecipientCard from '@/components/molecules/RecipientCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { recipientService } from '@/services/api/recipientService';
import { categoryService } from '@/services/api/categoryService';

const RecipientSelector = ({ selectedRecipients, onSelectionChange }) => {
  const [recipients, setRecipients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [recipientsData, categoriesData] = await Promise.all([
        recipientService.getAll(),
        categoryService.getAll()
      ]);
      setRecipients(recipientsData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to load recipients and categories');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipients = recipients.filter(recipient => {
    const matchesSearch = recipient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || recipient.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleToggleRecipient = (recipientId) => {
    const updatedSelection = selectedRecipients.includes(recipientId)
      ? selectedRecipients.filter(id => id !== recipientId)
      : [...selectedRecipients, recipientId];
    
    onSelectionChange(updatedSelection);
  };

  const handleSelectCategory = (categoryId) => {
    const category = categories.find(c => c.Id === parseInt(categoryId));
    if (category) {
      onSelectionChange(category.recipientIds);
      setSelectedCategory(categoryId);
    }
  };

  const handleSelectAll = () => {
    const allIds = filteredRecipients.map(r => r.Id);
    onSelectionChange(allIds);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
    setSelectedCategory('');
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Select Recipients</h3>
        <div className="text-sm text-gray-500">
          {selectedRecipients.length} selected
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search recipients..."
        />

        <div className="flex flex-wrap gap-3">
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-whatsapp-500 focus:border-whatsapp-500"
          >
            <option value="all">All Types</option>
            <option value="contact">Contacts</option>
            <option value="group">Groups</option>
            <option value="community">Communities</option>
          </select>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => handleSelectCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-whatsapp-500 focus:border-whatsapp-500"
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.Id} value={category.Id}>
                {category.name} ({category.recipientIds.length})
              </option>
            ))}
          </select>

          {/* Bulk Actions */}
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Recipients Grid */}
      {filteredRecipients.length === 0 ? (
        <Empty 
          title="No recipients found"
          description="Try adjusting your search or filter criteria."
          icon="Users"
        />
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {filteredRecipients.map((recipient) => (
            <motion.div
              key={recipient.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <RecipientCard
                recipient={recipient}
                selected={selectedRecipients.includes(recipient.Id)}
                onToggle={handleToggleRecipient}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RecipientSelector;