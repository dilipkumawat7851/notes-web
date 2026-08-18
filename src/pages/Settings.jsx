import React, { useState } from 'react';
import { User, Palette, FileEdit, Bell, Shield, Download, Trash2, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('appearance');
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();

  const [localTheme, setLocalTheme] = useState(theme || 'dark');
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'editor', label: 'Editor', icon: FileEdit },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    if (activeTab === 'appearance') {
      setTheme(localTheme);
      toast.success('Appearance settings saved');
    } else if (activeTab === 'profile') {
      updateUser({ name, avatar });
      toast.success('Profile settings saved');
    } else {
      toast.success('Settings saved');
    }
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setAvatar(event.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 w-full min-h-screen bg-[#111111] text-white">
      <h1 className="text-3xl font-bold mb-10">Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-12">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-[#1e1c31] text-blue-400' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-[#222533] rounded-xl border border-[#2D3142] p-8 min-h-[400px]">
          <form onSubmit={handleSave}>
            
            {activeTab === 'appearance' && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold text-white border-b border-[#2D3142] pb-4">Appearance</h2>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-4">Theme</label>
                  <div className="flex gap-6">
                    <label className="flex flex-col items-center gap-3 cursor-pointer group">
                      <div className={`w-28 h-20 rounded-lg border-2 ${localTheme === 'light' ? 'border-blue-500' : 'border-[#2D3142]'} bg-white transition-all`}></div>
                      <span className={`text-sm ${localTheme === 'light' ? 'text-white' : 'text-slate-400'}`}>Light</span>
                      <input type="radio" name="theme" value="light" checked={localTheme === 'light'} onChange={() => setLocalTheme('light')} className="sr-only" />
                    </label>
                    <label className="flex flex-col items-center gap-3 cursor-pointer group">
                      <div className={`w-28 h-20 rounded-lg border-2 ${localTheme === 'dark' ? 'border-blue-500' : 'border-[#2D3142]'} bg-[#111111] transition-all`}></div>
                      <span className={`text-sm ${localTheme === 'dark' ? 'text-white' : 'text-slate-400'}`}>Dark</span>
                      <input type="radio" name="theme" value="dark" checked={localTheme === 'dark'} onChange={() => setLocalTheme('dark')} className="sr-only" />
                    </label>
                    <label className="flex flex-col items-center gap-3 cursor-pointer group">
                      <div className={`w-28 h-20 rounded-lg border-2 ${localTheme === 'system' ? 'border-blue-500' : 'border-[#2D3142]'} bg-gradient-to-r from-slate-200 to-slate-800 transition-all`}></div>
                      <span className={`text-sm ${localTheme === 'system' ? 'text-white' : 'text-slate-400'}`}>System</span>
                      <input type="radio" name="theme" value="system" checked={localTheme === 'system'} onChange={() => setLocalTheme('system')} className="sr-only" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold text-white border-b border-[#2D3142] pb-4">Profile Information</h2>
                
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden border-2 border-[#2D3142]">
                      {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : (user?.name?.[0]?.toUpperCase() || 'U')}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="sr-only" />
                    </label>
                  </div>
                  <div className="text-sm text-slate-400">
                    <p>Click on the avatar to upload a custom photo.</p>
                    <p>Recommended size: 256x256px.</p>
                  </div>
                </div>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#2D3142] rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input type="email" value={user?.email || ''} readOnly className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#2D3142] rounded-lg text-slate-500 cursor-not-allowed outline-none" />
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'profile' && activeTab !== 'appearance' && (
              <div className="py-12 text-center text-slate-500">
                Settings for {activeTab} will be available soon.
              </div>
            )}

            <div className="mt-12 pt-6 border-t border-[#2D3142] flex justify-end">
              <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
                Save Changes
              </button>
            </div>
          </form>

          {activeTab === 'security' && (
            <div className="mt-12 pt-8 border-t border-[#2D3142]">
              <h3 className="text-red-500 font-medium mb-6">Danger Zone</h3>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-5 py-2.5 border border-[#2D3142] rounded-lg hover:bg-[#1A1A1A] transition-colors text-slate-300">
                  <Download className="w-4 h-4" /> Export Data
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
