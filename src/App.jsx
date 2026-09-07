import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Websites from './pages/Websites';
import WorkLogs from './pages/WorkLogs';
import TeamMatrix from './pages/TeamMatrix';
import UsersPage from './pages/Users';
import WorkLogModal from './components/WorkLogModal';
import WebsiteModal from './components/WebsiteModal';
import TimelineModal from './components/TimelineModal';
import api from './services/api';

function MainApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stagnantCount, setStagnantCount] = useState(0);

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logInitialWebsiteId, setLogInitialWebsiteId] = useState(null);

  const [isWebsiteModalOpen, setIsWebsiteModalOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState(null);

  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [timelineWebsiteId, setTimelineWebsiteId] = useState(null);

  // Refresh key to trigger refetches across child components
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (user) {
      fetchStagnantCount();
    }
  }, [user, refreshKey]);

  const fetchStagnantCount = async () => {
    try {
      const res = await api.get('/websites?isStagnant=true');
      setStagnantCount(res.data.length);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenLogModal = (siteId = null) => {
    setLogInitialWebsiteId(siteId);
    setIsLogModalOpen(true);
  };

  const handleViewTimeline = (siteId) => {
    setTimelineWebsiteId(siteId);
    setIsTimelineOpen(true);
  };

  const handleAddWebsite = () => {
    setEditingWebsite(null);
    setIsWebsiteModalOpen(true);
  };

  const handleEditWebsite = (site) => {
    setEditingWebsite(site);
    setIsWebsiteModalOpen(true);
  };

  const handleDataChanged = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-400 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading SEO Operations Tracker...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar onOpenLogModal={() => handleOpenLogModal()} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          stagnantCount={stagnantCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              key={refreshKey}
              onOpenLogModal={handleOpenLogModal}
              onViewTimeline={handleViewTimeline}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'websites' && (
            <Websites
              key={refreshKey}
              onOpenLogModal={handleOpenLogModal}
              onViewTimeline={handleViewTimeline}
              onAddWebsite={handleAddWebsite}
              onEditWebsite={handleEditWebsite}
              onlyStagnant={false}
            />
          )}

          {activeTab === 'stagnant' && (
            <Websites
              key={`stagnant-${refreshKey}`}
              onOpenLogModal={handleOpenLogModal}
              onViewTimeline={handleViewTimeline}
              onAddWebsite={handleAddWebsite}
              onEditWebsite={handleEditWebsite}
              onlyStagnant={true}
            />
          )}

          {activeTab === 'worklogs' && (
            <WorkLogs
              key={refreshKey}
              onOpenLogModal={handleOpenLogModal}
            />
          )}

          {activeTab === 'team-matrix' && (
            <TeamMatrix
              key={refreshKey}
              onViewTimeline={handleViewTimeline}
            />
          )}

          {activeTab === 'users' && (
            <UsersPage key={refreshKey} />
          )}
        </main>
      </div>

      {/* Modals */}
      <WorkLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        initialWebsiteId={logInitialWebsiteId}
        onSuccess={handleDataChanged}
      />

      <WebsiteModal
        isOpen={isWebsiteModalOpen}
        onClose={() => setIsWebsiteModalOpen(false)}
        website={editingWebsite}
        onSuccess={handleDataChanged}
      />

      <TimelineModal
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        websiteId={timelineWebsiteId}
        onLogWork={(siteId) => handleOpenLogModal(siteId)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}