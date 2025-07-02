import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const RecipientCard = ({ recipient, selected, onToggle, className = '' }) => {
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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`card p-4 cursor-pointer ${selected ? 'ring-2 ring-whatsapp-500' : ''} ${className}`}
      onClick={() => onToggle(recipient.Id)}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-whatsapp-100 to-whatsapp-200 rounded-full flex items-center justify-center">
            <ApperIcon name={getTypeIcon(recipient.type)} className="w-6 h-6 text-whatsapp-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">{recipient.name}</h3>
            <Badge variant={getTypeColor(recipient.type)} size="sm">
              {recipient.type}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            {recipient.phoneNumber && (
              <span>{recipient.phoneNumber}</span>
            )}
            {recipient.memberCount && (
              <span className="flex items-center">
                <ApperIcon name="Users" className="w-3 h-3 mr-1" />
                {recipient.memberCount} members
              </span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
            selected 
              ? 'bg-whatsapp-500 border-whatsapp-500' 
              : 'border-gray-300 hover:border-whatsapp-400'
          }`}>
            {selected && (
              <ApperIcon name="Check" className="w-3 h-3 text-white" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipientCard;