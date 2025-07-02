import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import StatusPill from '@/components/molecules/StatusPill';

const Settings = () => {
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [settings, setSettings] = useState({
    defaultSpeed: 'medium',
    defaultBanProtection: 'none',
    autoSave: true,
    notifications: true,
    maxRecipients: 100
  });

  const [qrCode, setQrCode] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    setConnectionStatus('connecting');
    
    // Simulate QR code generation
    setTimeout(() => {
      setQrCode('/api/placeholder/200/200');
      toast.info('Scan the QR code with your WhatsApp mobile app');
    }, 1000);

    // Simulate successful connection
    setTimeout(() => {
      setConnectionStatus('connected');
      setQrCode(null);
      setConnecting(false);
      toast.success('WhatsApp Web connected successfully!');
    }, 5000);
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
    setQrCode(null);
    toast.info('WhatsApp Web disconnected');
  };

  const handleSaveSettings = () => {
    // In a real app, save to backend
    toast.success('Settings saved successfully');
  };

  const speedOptions = [
    { value: 'low', label: 'Low (3 seconds)', description: 'Fastest sending, higher risk' },
    { value: 'medium', label: 'Medium (10 seconds)', description: 'Balanced speed and safety' },
    { value: 'high', label: 'High (15 seconds)', description: 'Safest option, slower sending' }
  ];

  const protectionOptions = [
    { value: 'none', label: 'None', description: 'Send messages as-is' },
    { value: 'random', label: 'Random String', description: 'Append random characters' },
    { value: 'timestamp', label: 'Date & Time', description: 'Append current timestamp' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your WhatsApp bulk messaging preferences</p>
      </div>

      {/* WhatsApp Connection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">WhatsApp Connection</h3>
            <p className="text-gray-600 text-sm mt-1">Manage your WhatsApp Web connection</p>
          </div>
          <StatusPill status={connectionStatus} />
        </div>

        {connectionStatus === 'connected' ? (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-green-900">Connected Successfully</div>
                <div className="text-sm text-green-700">Your WhatsApp account is ready for bulk messaging</div>
              </div>
            </div>
            <Button variant="secondary" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        ) : connectionStatus === 'connecting' ? (
          <div className="text-center py-8">
            {qrCode ? (
              <div>
                <div className="w-48 h-48 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="w-40 h-40 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                    <ApperIcon name="QrCode" className="w-20 h-20 text-gray-400" />
                  </div>
                </div>
                <div className="text-lg font-medium text-gray-900 mb-2">Scan QR Code</div>
                <div className="text-gray-600">Open WhatsApp on your phone and scan this QR code</div>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 border-4 border-whatsapp-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-lg font-medium text-gray-900">Generating QR Code...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-lg font-medium text-gray-900 mb-2">Not Connected</div>
            <div className="text-gray-600 mb-6">Connect your WhatsApp account to start sending bulk messages</div>
            <Button onClick={handleConnect} loading={connecting}>
              Connect WhatsApp
            </Button>
          </div>
        )}
      </motion.div>

      {/* Default Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Default Send Settings</h3>

        <div className="space-y-8">
          {/* Default Speed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Default Send Speed
            </label>
            <div className="space-y-3">
              {speedOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    settings.defaultSpeed === option.value
                      ? 'border-whatsapp-500 bg-whatsapp-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSettings({ ...settings, defaultSpeed: option.value })}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      settings.defaultSpeed === option.value
                        ? 'border-whatsapp-500 bg-whatsapp-500'
                        : 'border-gray-300'
                    }`}>
                      {settings.defaultSpeed === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Default Ban Protection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Default Ban Protection
            </label>
            <div className="space-y-3">
              {protectionOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    settings.defaultBanProtection === option.value
                      ? 'border-whatsapp-500 bg-whatsapp-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSettings({ ...settings, defaultBanProtection: option.value })}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      settings.defaultBanProtection === option.value
                        ? 'border-whatsapp-500 bg-whatsapp-500'
                        : 'border-gray-300'
                    }`}>
                      {settings.defaultBanProtection === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* App Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">App Preferences</h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Auto-save drafts</div>
              <div className="text-sm text-gray-500">Automatically save message drafts as you type</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whatsapp-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Push notifications</div>
              <div className="text-sm text-gray-500">Receive notifications for send completion</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whatsapp-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whatsapp-500"></div>
            </label>
          </div>

          <div>
            <Input
              label="Maximum Recipients per Session"
              type="number"
              value={settings.maxRecipients}
              onChange={(e) => setSettings({ ...settings, maxRecipients: parseInt(e.target.value) })}
              min="1"
              max="1000"
            />
            <div className="text-xs text-gray-500 mt-1">
              Current plan limit: 100 recipients
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} icon="Save">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;