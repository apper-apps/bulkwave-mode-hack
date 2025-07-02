import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const SendConfiguration = ({ config, onChange }) => {
  const speedOptions = [
    { value: 'low', label: 'Low (3s delay)', description: 'Fastest sending, higher risk' },
    { value: 'medium', label: 'Medium (10s delay)', description: 'Balanced speed and safety' },
    { value: 'high', label: 'High (15s delay)', description: 'Safest option, slower sending' }
  ];

  const banProtectionOptions = [
    { value: 'none', label: 'None', description: 'Send messages as-is' },
    { value: 'random', label: 'Random String', description: 'Append random characters' },
    { value: 'timestamp', label: 'Date & Time', description: 'Append current timestamp' }
  ];

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Send Configuration</h3>

      {/* Send Speed */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Send Speed
        </label>
        <div className="space-y-3">
          {speedOptions.map((option) => (
            <div
              key={option.value}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                config.speed === option.value
                  ? 'border-whatsapp-500 bg-whatsapp-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onChange({ ...config, speed: option.value })}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  config.speed === option.value
                    ? 'border-whatsapp-500 bg-whatsapp-500'
                    : 'border-gray-300'
                }`}>
                  {config.speed === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
                <ApperIcon 
                  name={
                    option.value === 'low' ? 'Zap' : 
                    option.value === 'medium' ? 'Clock' : 'Shield'
                  } 
                  className={`w-5 h-5 ${
                    config.speed === option.value ? 'text-whatsapp-600' : 'text-gray-400'
                  }`} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ban Protection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Ban Protection
        </label>
        <div className="space-y-3">
          {banProtectionOptions.map((option) => (
            <div
              key={option.value}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                config.banProtection === option.value
                  ? 'border-whatsapp-500 bg-whatsapp-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onChange({ ...config, banProtection: option.value })}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  config.banProtection === option.value
                    ? 'border-whatsapp-500 bg-whatsapp-500'
                    : 'border-gray-300'
                }`}>
                  {config.banProtection === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
                <ApperIcon 
                  name={
                    option.value === 'none' ? 'AlertTriangle' : 
                    option.value === 'random' ? 'Shuffle' : 'Calendar'
                  } 
                  className={`w-5 h-5 ${
                    config.banProtection === option.value ? 'text-whatsapp-600' : 'text-gray-400'
                  }`} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SendConfiguration;