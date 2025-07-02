import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import MessageComposer from '@/components/organisms/MessageComposer';
import RecipientSelector from '@/components/organisms/RecipientSelector';
import SendConfiguration from '@/components/organisms/SendConfiguration';
import SendProgressModal from '@/components/organisms/SendProgressModal';
import { sendSessionService } from '@/services/api/sendSessionService';
import { recipientService } from '@/services/api/recipientService';

const SendMessage = () => {
  const [message, setMessage] = useState({
    content: '',
    mediaUrl: null,
    mediaType: 'none'
  });
  
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  
  const [config, setConfig] = useState({
    speed: 'medium',
    banProtection: 'none'
  });

  const [currentSession, setCurrentSession] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [sending, setSending] = useState(false);

  const handleMediaUpload = (file) => {
    // In a real app, you would upload the file to a server
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
    const mediaUrl = URL.createObjectURL(file);
    
    setMessage(prev => ({
      ...prev,
      mediaUrl,
      mediaType
    }));
    
    toast.success(`${mediaType === 'video' ? 'Video' : 'Image'} uploaded successfully`);
  };

  const handleSend = async () => {
    if (!message.content.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

    try {
      setSending(true);
      
      // Create send session
      const sessionData = {
        messageId: `msg-${Date.now()}`,
        recipientIds: selectedRecipients,
        speed: config.speed,
        banProtection: config.banProtection,
        status: 'pending',
        progress: 0,
        startedAt: new Date().toISOString()
      };

      const session = await sendSessionService.create(sessionData);
      setCurrentSession(session);
      setShowProgress(true);

      // Start sending simulation
      simulateSending(session);
      
      toast.success('Message sending started!');
    } catch (error) {
      toast.error('Failed to start sending');
    } finally {
      setSending(false);
    }
  };

  const simulateSending = async (session) => {
    const delayMap = {
      low: 3000,
      medium: 10000,
      high: 15000
    };
    
    const delay = delayMap[session.speed];
    const totalRecipients = session.recipientIds.length;
    
    // Update session to sending
    const updatedSession = await sendSessionService.update(session.Id, {
      status: 'sending'
    });
    setCurrentSession(updatedSession);

    // Simulate progress
    for (let i = 1; i <= totalRecipients; i++) {
      await new Promise(resolve => setTimeout(resolve, delay));
      
      const progress = (i / totalRecipients) * 100;
      const progressSession = await sendSessionService.update(session.Id, {
        progress: Math.round(progress),
        status: i === totalRecipients ? 'completed' : 'sending',
        completedAt: i === totalRecipients ? new Date().toISOString() : undefined
      });
      
      setCurrentSession(progressSession);
    }
    
    toast.success('All messages sent successfully!');
  };

  const getRecipientsForProgress = () => {
    if (!selectedRecipients.length) return [];
    
    return selectedRecipients.map(async (id) => {
      return await recipientService.getById(id);
    });
  };

  const [progressRecipients, setProgressRecipients] = useState([]);

  React.useEffect(() => {
    if (showProgress && selectedRecipients.length > 0) {
      Promise.all(selectedRecipients.map(id => recipientService.getById(id)))
        .then(setProgressRecipients);
    }
  }, [showProgress, selectedRecipients]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Send Message</h1>
        <p className="text-gray-600 mt-1">Compose and send bulk WhatsApp messages</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Message & Recipients */}
        <div className="lg:col-span-2 space-y-6">
          <MessageComposer
            message={message}
            onChange={setMessage}
            onMediaUpload={handleMediaUpload}
          />
          
          <RecipientSelector
            selectedRecipients={selectedRecipients}
            onSelectionChange={setSelectedRecipients}
          />
        </div>

        {/* Right Column - Configuration & Send */}
        <div className="space-y-6">
          <SendConfiguration
            config={config}
            onChange={setConfig}
          />

          {/* Send Summary */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Recipients:</span>
                <span className="font-medium">{selectedRecipients.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Send Speed:</span>
                <span className="font-medium capitalize">{config.speed}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ban Protection:</span>
                <span className="font-medium capitalize">
                  {config.banProtection === 'none' ? 'None' : 
                   config.banProtection === 'random' ? 'Random String' : 'Timestamp'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Message Length:</span>
                <span className="font-medium">{message.content.length} chars</span>
              </div>
              
              {message.mediaUrl && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Media:</span>
                  <span className="font-medium capitalize">{message.mediaType}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                onClick={handleSend}
                loading={sending}
                disabled={!message.content.trim() || selectedRecipients.length === 0}
                className="w-full"
                icon="Send"
              >
                Send to {selectedRecipients.length} Recipients
              </Button>
              
              <div className="text-xs text-gray-500 text-center mt-2">
                Estimated time: {Math.ceil(selectedRecipients.length * (
                  config.speed === 'low' ? 3 : 
                  config.speed === 'medium' ? 10 : 15
                ) / 60)} minutes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Modal */}
      <SendProgressModal
        isOpen={showProgress}
        onClose={() => setShowProgress(false)}
        session={currentSession}
        recipients={progressRecipients}
      />
    </div>
  );
};

export default SendMessage;