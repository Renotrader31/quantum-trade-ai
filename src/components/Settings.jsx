import React from 'react';

const Settings = ({ apiKeys, onApiKeysUpdate, theme, setTheme }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <p className="text-gray-400">
        Configure your API keys and preferences...
      </p>
    </div>
  );
};

export default Settings;
