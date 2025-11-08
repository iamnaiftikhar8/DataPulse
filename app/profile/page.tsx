'use client';

import React, { useEffect, useState } from 'react';
import { User, FileText, Calendar, Download, Crown, BarChart3, Settings, Shield, CreditCard, Star, Zap, Edit3, Save, X, Mail, Building, Briefcase, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface UserProfile {
  user_id: string;
  email: string;
  user_name: string;
  full_name: string;
  company: string;
  role: string;
  is_premium: boolean;
  created_at: string;
  last_login: string;
}

interface Report {
  id: string;
  filename: string;
  file_size: number;
  upload_date: string;
  analysis_date: string;
  download_url?: string;
  upload_id?: string; 
}

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeSection, setActiveSection] = useState<'profile' | 'reports' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    company: '',
    role: ''
  });
  const [saving, setSaving] = useState(false);

  // Handle hash changes and initial load
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      console.log('Hash changed to:', hash);
      
      if (hash === 'reports' || hash === 'analysishistory') {
        setActiveSection('reports');
      } else if (hash === 'settings' || hash === 'accountsettings') {
        setActiveSection('settings');
      } else {
        setActiveSection('profile');
      }
    };

    // Initial check
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Also check hash on component mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    console.log('Initial hash:', hash);
    
    if (hash === 'reports' || hash === 'analysishistory') {
      setActiveSection('reports');
    } else if (hash === 'settings' || hash === 'accountsettings') {
      setActiveSection('settings');
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      console.log('🔍 Fetching user profile from:', `${API_BASE}/api/user/profile`);
      
      const response = await fetch(`${API_BASE}/api/user/profile`, {
        credentials: 'include',
      });
      
      console.log('📤 Profile response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ User profile data:', data);
        setUserInfo(data);
      
      } else {
        console.error('❌ Failed to fetch user profile:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      console.log('📥 Fetching PDF reports from:', `${API_BASE}/api/user/pdf-reports`);
      
      const response = await fetch(`${API_BASE}/api/user/pdf-reports`, {
        credentials: 'include',
      });
      
      console.log('📤 PDF reports response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📋 PDF reports data received:', data);
        console.log('📊 Number of reports:', data.reports?.length || 0);
        setReports(data.reports || []);
      } else {
        console.error('❌ Failed to fetch PDF reports:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching PDF reports:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchReports();
  }, []);

 

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getInitials = (name: string) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase()
      : 'U';
  };

  const downloadPdf = async (reportId: string, filename: string) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/download-pdf/${reportId}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('❌ Failed to download PDF');
        alert('Failed to download PDF. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    }
  };


  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-200">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute top-3/4 right-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/2 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-8">
     

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                    <p className="text-gray-400 mt-2">Manage your personal and professional details</p>
                  </div>
          
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <div className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3.5 text-gray-300 backdrop-blur-sm">
                        {userInfo?.email}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3.5 text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-300"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3.5 text-gray-300 backdrop-blur-sm">
                          {userInfo?.full_name || 'Not specified'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <div className="text-gray-400 text-sm">Member Since</div>
                        <div className="text-white font-medium">
                          {userInfo ? formatDate(userInfo.created_at) : '---'}
                        </div>
                      </div>
                      <Calendar className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <div className="text-gray-400 text-sm">Last Login</div>
                        <div className="text-white font-medium">
                          {userInfo ? formatDate(userInfo.last_login) : '---'}
                        </div>
                      </div>
                      <Clock className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                </div>                
              </div>
            )}

            {/* Reports Section */}
            {activeSection === 'reports' && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Analysis History</h2>
                    <p className="text-gray-400 mt-2">Review your past data analysis reports</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Total Reports</div>
                    <div className="text-2xl font-bold text-cyan-400">{reports.length}</div>
                  </div>
                </div>

                {reports.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-400 mb-3">No reports yet</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Start your data analysis journey by uploading your first dataset
                    </p>
                   
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report, index) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                              <FileText className="w-6 h-6 text-cyan-400" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm group-hover:text-cyan-400 transition-colors duration-300 truncate">
                              {report.filename}
                            </h3>
                            <div className="flex items-center gap-6 mt-2 text-sm text-gray-400 flex-wrap">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(report.analysis_date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {formatFileSize(report.file_size)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => downloadPdf(report.id, report.filename)}
                          className="p-3 rounded-xl bg-green-500/10 text-green-400 hover:text-green-300 hover:bg-green-500/20 border border-green-500/30 transition-all duration-300 group/button"
                          title="Download PDF analysis report"
                        >
                          <Download className="w-5 h-5 group-hover/button:scale-110 transition-transform duration-300" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white">Account Settings</h2>
                  <p className="text-gray-400 mt-2">Manage your account preferences and security</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                          <Star className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">Upgrade</h3>
                          <p className="text-gray-400 text-sm">Unlock premium features</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => window.location.href = '/pricing'}
                        className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:from-cyan-400 hover:to-blue-500"
                      >
                        Upgrade to Premium
                      </button>
                    </div>
             
            
                  </div>

                  <div className="space-y-6">
                   

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}