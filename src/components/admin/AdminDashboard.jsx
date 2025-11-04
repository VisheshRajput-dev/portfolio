import React, { useState, useEffect } from 'react';
import { adminLogout } from '../../firebase/auth';
import { getExperiences, getContactSubmissions } from '../../firebase/database';
import { initializeExperiences } from '../../utils/populateExperiences';
import ExperienceManager from './ExperienceManager';
import ContactManager from './ContactManager';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('experiences');
  const [experiences, setExperiences] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Initialize experiences if they don't exist
      await initializeExperiences();
      
      const [expData, subData] = await Promise.all([
        getExperiences(),
        getContactSubmissions()
      ]);
      setExperiences(expData);
      setSubmissions(subData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await adminLogout();
    onLogout();
  };

  const tabs = [
    { id: 'experiences', label: 'Experience Timeline', count: experiences.length },
    { id: 'contacts', label: 'Contact Submissions', count: submissions.length }
  ];

  return (
    <div className="min-h-screen bg-[rgba(0,0,0,0.75)] backdrop-blur-xl">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300 text-sm">Welcome, {user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-md transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="font-medium">{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-gray-500/20'
                }`}>
                  {tab.count}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'experiences' && (
              <ExperienceManager 
                experiences={experiences} 
                onUpdate={loadData}
              />
            )}
            {activeTab === 'contacts' && (
              <ContactManager 
                submissions={submissions} 
                onUpdate={loadData}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
