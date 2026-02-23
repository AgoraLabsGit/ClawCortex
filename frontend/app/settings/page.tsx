'use client';

import { useState } from 'react';
import { Github, Database, Brain, Check } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'integrations', label: 'Integrations' },
  ];

  const integrations = [
    {
      name: 'GitHub',
      icon: Github,
      status: 'connected',
      lastSync: '2 minutes ago',
    },
    {
      name: 'Supabase',
      icon: Database,
      status: 'connected',
      lastSync: '5 minutes ago',
    },
    {
      name: 'OpenAI',
      icon: Brain,
      status: 'connected',
      lastSync: '10 minutes ago',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your account and integrations</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 border-b border-slate-800">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl">
          <div className="mb-8">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
              A
            </div>
            <p className="text-sm text-slate-400">Profile Avatar</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value="alex"
                readOnly
                className="w-full rounded-lg bg-slate-800 px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value="alex@example.com"
                readOnly
                className="w-full rounded-lg bg-slate-800 px-4 py-2 text-white"
              />
            </div>

            <button className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <div
                key={integration.name}
                className="rounded-lg bg-slate-800 p-6 hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-700 p-3">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {integration.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {integration.status === 'connected' && (
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 bg-green-500 rounded-full" />
                            Connected
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-400">Last sync</p>
                  <p className="text-sm text-slate-300 mt-1">
                    {integration.lastSync}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-600 transition-colors">
                    Sync
                  </button>
                  <button className="flex-1 rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-600 transition-colors">
                    Disconnect
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
