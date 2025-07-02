import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { recipientService } from '@/services/api/recipientService';
import { format } from 'date-fns';

const Recipients = () => {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await recipientService.getAll();
      setRecipients(data);
    } catch (err) {
      setError('Failed to load recipients');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedRecipients = recipients
    .filter(recipient => {
      const matchesSearch = recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (recipient.phoneNumber && recipient.phoneNumber.includes(searchTerm));
      const matchesType = filterType === 'all' || recipient.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'members':
          return (b.memberCount || 0) - (a.memberCount || 0);
        case 'recent':
          return new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0);
        default:
          return 0;
      }
    });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'contact': return 'User';
      case 'group': return 'Users';
      case 'community': return 'Building';
      default: return 'User';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'contact': return 'info';
      case 'group': return 'whatsapp';
      case 'community': return 'warning';
      default: return 'default';
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadRecipients} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recipients</h1>
          <p className="text-gray-600 mt-1">Manage your WhatsApp contacts, groups, and communities</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button icon="RefreshCw" onClick={loadRecipients}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-whatsapp-100 to-whatsapp-200 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="Users" className="w-6 h-6 text-whatsapp-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{recipients.length}</div>
              <div className="text-sm text-gray-500">Total Recipients</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="User" className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {recipients.filter(r => r.type === 'contact').length}
              </div>
              <div className="text-sm text-gray-500">Contacts</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="Users" className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {recipients.filter(r => r.type === 'group').length}
              </div>
              <div className="text-sm text-gray-500">Groups</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="Building" className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {recipients.filter(r => r.type === 'community').length}
              </div>
              <div className="text-sm text-gray-500">Communities</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search recipients..."
            />
          </div>
          
          <div className="flex space-x-4">
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

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-whatsapp-500 focus:border-whatsapp-500"
            >
              <option value="name">Sort by Name</option>
              <option value="type">Sort by Type</option>
              <option value="members">Sort by Members</option>
              <option value="recent">Sort by Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recipients List */}
      <div className="card">
        {filteredAndSortedRecipients.length === 0 ? (
          <Empty 
            title="No recipients found"
            description="Try adjusting your search or filter criteria."
            icon="Users"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Recipient</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Type</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Members</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Phone</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Last Message</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedRecipients.map((recipient, index) => (
                  <motion.tr
                    key={recipient.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-whatsapp-100 to-whatsapp-200 rounded-full flex items-center justify-center">
                          <ApperIcon 
                            name={getTypeIcon(recipient.type)} 
                            className="w-5 h-5 text-whatsapp-600" 
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{recipient.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={getTypeColor(recipient.type)} size="sm">
                        {recipient.type}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      {recipient.memberCount ? (
                        <span className="text-gray-900">{recipient.memberCount.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {recipient.phoneNumber ? (
                        <span className="text-gray-900">{recipient.phoneNumber}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {recipient.lastMessageTime ? (
                        <span className="text-gray-900">
                          {format(new Date(recipient.lastMessageTime), 'MMM d, yyyy')}
                        </span>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipients;