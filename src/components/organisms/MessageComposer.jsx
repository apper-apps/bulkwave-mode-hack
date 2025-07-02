import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const MessageComposer = ({ message, onChange, onMediaUpload }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onMediaUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      onMediaUpload(e.target.files[0]);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Compose Message</h3>
      
      {/* Text Message */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message Content
        </label>
        <textarea
          value={message.content}
          onChange={(e) => onChange({ ...message, content: e.target.value })}
          placeholder="Type your message here..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-whatsapp-500 focus:border-whatsapp-500 resize-none"
        />
        <div className="text-xs text-gray-500 mt-1">
          {message.content.length} characters
        </div>
      </div>

      {/* Media Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Media (Optional)
        </label>
        
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-whatsapp-500 bg-whatsapp-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-2">
            <ApperIcon name="Upload" className="w-8 h-8 text-gray-400 mx-auto" />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-whatsapp-600">Click to upload</span> or drag and drop
            </div>
            <div className="text-xs text-gray-500">
              PNG, JPG, MP4 up to 10MB
            </div>
          </div>
        </div>

        {/* Media Preview */}
        {message.mediaUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-whatsapp-100 rounded-lg flex items-center justify-center">
                  <ApperIcon 
                    name={message.mediaType === 'video' ? 'Video' : 'Image'} 
                    className="w-6 h-6 text-whatsapp-600" 
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {message.mediaType === 'video' ? 'Video' : 'Image'} attached
                  </div>
                  <div className="text-xs text-gray-500">Ready to send</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange({ ...message, mediaUrl: null, mediaType: 'none' })}
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MessageComposer;