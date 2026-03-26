import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Book, Award, Clock, ChevronRight, Edit3, Settings, LogOut, Shield, Zap, Star } from 'lucide-react';
import authService from '../services/authService';
import courseService from '../services/courseService';
import progressService from '../services/progressService';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getStoredUser());
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    certificates: 0,
    points: 1250
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // In a real app, we'd fetch actual progress from the backend
          // Mocking some data for now based on user role
          const courses = await courseService.getAllCourses();
          // Simulate some enrolled courses
          setEnrolledCourses(courses.slice(0, 2));
          
          setStats({
            completed: 1,
            inProgress: 1,
            certificates: 1,
            points: 1250
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleEditProfile = () => {
    alert('Edit profile feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 sm:-mt-20">
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-3xl p-2 shadow-xl border border-white">
                  <div className="w-full h-full bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-5xl font-black uppercase tracking-tighter">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <button 
                  onClick={handleEditProfile}
                  className="absolute bottom-2 right-2 p-2.5 bg-white text-slate-600 hover:text-indigo-600 rounded-xl shadow-lg border border-slate-100 transition-all hover:scale-110"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user?.name || 'User Name'}</h1>
                    <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" /> {user?.email || 'user@example.com'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleEditProfile}
                      className="px-6 py-2.5 bg-slate-50 text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" /> Update Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="px-6 py-2.5 bg-rose-50 text-rose-500 font-bold rounded-xl border border-rose-100 hover:bg-rose-100 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Courses Completed', value: stats.completed, icon: Book, color: 'emerald' },
            { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'indigo' },
            { label: 'Certificates', value: stats.certificates, icon: Award, color: 'amber' },
            { label: 'Learning Points', value: stats.points, icon: Zap, color: 'blue' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
                  <p className="text-sm font-semibold text-slate-500 mt-1">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continuing Learning */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Your Courses</h3>
                <button onClick={() => navigate('/catalog')} className="text-sm font-bold text-indigo-600 hover:underline">View Catalog</button>
              </div>

              <div className="space-y-4">
                {enrolledCourses.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                      <Book className="w-8 h-8" />
                    </div>
                    <p className="text-slate-500 font-medium">No courses enrolled yet</p>
                    <button 
                      onClick={() => navigate('/catalog')}
                      className="mt-4 px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all text-sm"
                    >
                      Browse Courses
                    </button>
                  </div>
                ) : (
                  enrolledCourses.map((course) => (
                    <div 
                      key={course.id}
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group cursor-pointer"
                    >
                      <div className="w-20 h-14 bg-slate-100 rounded-xl overflow-hidden shadow-sm">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-bold text-slate-900">{course.title}</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[150px]">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                          <span className="text-[10px] font-black text-slate-400">45% COMPLETED</span>
                        </div>
                      </div>
                      <button className="p-2 text-slate-300 group-hover:text-indigo-600 transition-colors">
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Recent Achievements</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                  { title: 'First Steps', desc: 'Started first course', icon: Star, color: 'blue' },
                  { title: 'Goal Crusher', desc: 'Completed a quiz', icon: Zap, color: 'amber' },
                  { title: 'Scholar', desc: '10 hours learning', icon: Shield, color: 'emerald' }
                ].map((badge, idx) => (
                  <div key={idx} className="text-center group cursor-pointer">
                    <div className={`w-16 h-16 mx-auto bg-slate-50 text-${badge.color}-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm group-hover:shadow-md border border-slate-100 group-hover:border-${badge.color}-100`}>
                      <badge.icon className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 leading-none">{badge.title}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Account Status */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 bg-gradient-to-br from-indigo-600 to-blue-700 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Shield className="w-32 h-32 rotate-12" />
              </div>
              <div className="relative z-10">
                <Shield className="w-10 h-10 mb-6" />
                <h3 className="text-xl font-black tracking-tight mb-2">Pro Member</h3>
                <p className="text-indigo-100 text-sm font-medium mb-6 leading-relaxed">
                  Your access to all premium materials is active until Feb 2027.
                </p>
                <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg">
                  Subscription Details
                </button>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">Security & Settings</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-slate-50 group">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Change Password</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-slate-50 group">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Email Preferences</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
