import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const StatusPill = ({ status, className = '' }) => {
  const statusConfig = {
    connected: {
      icon: 'CheckCircle2',
      text: 'Connected',
      classes: 'bg-green-100 text-green-800'
    },
    disconnected: {
      icon: 'XCircle',
      text: 'Disconnected',
      classes: 'bg-red-100 text-red-800'
    },
    connecting: {
      icon: 'Loader2',
      text: 'Connecting...',
      classes: 'bg-yellow-100 text-yellow-800'
    },
    sending: {
      icon: 'Send',
      text: 'Sending',
      classes: 'bg-blue-100 text-blue-800'
    },
    completed: {
      icon: 'CheckCircle',
      text: 'Completed',
      classes: 'bg-green-100 text-green-800'
    },
    paused: {
      icon: 'Pause',
      text: 'Paused',
      classes: 'bg-gray-100 text-gray-800'
    },
    pending: {
      icon: 'Clock',
      text: 'Pending',
      classes: 'bg-yellow-100 text-yellow-800'
    }
  };

  const config = statusConfig[status] || statusConfig.disconnected;

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.classes} ${className}`}>
      <ApperIcon 
        name={config.icon} 
        className={`w-3 h-3 mr-1.5 ${status === 'connecting' ? 'animate-spin' : ''}`} 
      />
      {config.text}
    </div>
  );
};

export default StatusPill;