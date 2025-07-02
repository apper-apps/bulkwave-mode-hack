import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProgressRing from '@/components/molecules/ProgressRing';
import StatusPill from '@/components/molecules/StatusPill';

const SendProgressModal = ({ isOpen, onClose, session, recipients }) => {
  if (!isOpen || !session) return null;

  const sentCount = Math.floor((session.progress / 100) * recipients.length);
  const remainingCount = recipients.length - sentCount;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Sending Progress</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {sentCount} of {recipients.length} messages sent
                  </p>
                </div>
                <StatusPill status={session.status} />
              </div>
            </div>

            {/* Progress Section */}
            <div className="p-6">
              <div className="flex items-center justify-center mb-8">
                <ProgressRing progress={session.progress} />
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{sentCount}</div>
                  <div className="text-sm text-gray-500">Sent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{remainingCount}</div>
                  <div className="text-sm text-gray-500">Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{recipients.length}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>

              {/* Recipients List */}
              <div className="max-h-64 overflow-y-auto">
                <h4 className="font-medium text-gray-900 mb-3">Recipients Status</h4>
                <div className="space-y-2">
                  {recipients.map((recipient, index) => (
                    <div
                      key={recipient.Id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-whatsapp-100 rounded-full flex items-center justify-center">
                          <ApperIcon 
                            name={recipient.type === 'group' ? 'Users' : 'User'} 
                            className="w-4 h-4 text-whatsapp-600" 
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{recipient.name}</div>
                          <div className="text-xs text-gray-500">{recipient.type}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {index < sentCount ? (
                          <div className="flex items-center text-green-600">
                            <ApperIcon name="CheckCircle" className="w-4 h-4 mr-1" />
                            <span className="text-xs">Sent</span>
                          </div>
                        ) : index === sentCount && session.status === 'sending' ? (
                          <div className="flex items-center text-blue-600">
                            <ApperIcon name="Loader2" className="w-4 h-4 mr-1 animate-spin" />
                            <span className="text-xs">Sending</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-400">
                            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                            <span className="text-xs">Pending</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {session.status === 'sending' && 'Please keep this window open while sending...'}
                  {session.status === 'completed' && 'All messages have been sent successfully!'}
                  {session.status === 'paused' && 'Sending has been paused.'}
                </div>
                
                <div className="flex space-x-3">
                  {session.status === 'sending' && (
                    <Button variant="secondary" size="sm">
                      Pause
                    </Button>
                  )}
                  {session.status === 'paused' && (
                    <Button variant="primary" size="sm">
                      Resume
                    </Button>
                  )}
                  <Button 
                    variant={session.status === 'completed' ? 'primary' : 'secondary'}
                    size="sm" 
                    onClick={onClose}
                  >
                    {session.status === 'completed' ? 'Done' : 'Close'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SendProgressModal;