import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Users, BookOpen, Clock, Settings, LogOut, Search, Bell, ChevronRight, BarChart3, Star, Award, Plus, X, Video, FileText, Loader2 } from 'lucide-react';
import authService from '../services/authService';
import courseService from '../services/courseService';

const MentorDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(authService.getStoredUser());
    const [courses, setCourses] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [newCourse, setNewCourse] = useState({
        title: '',
        category: 'Beginner & Foundational (No/Low Coding)',
        description: '',
        price: '0',
        isFree: true
    });

    // Form State for dynamic lists
    const [videosList, setVideosList] = useState([
        { id: '1', title: 'Introduction', file: null }
    ]);
    const [resourcesList, setResourcesList] = useState([
        { id: '1', title: 'Syllabus', type: 'pdf', file: null }
    ]);

    const [thumbnailFile, setThumbnailFile] = useState(null);

    const addVideo = () => setVideosList([...videosList, { id: Date.now().toString(), title: '', file: null }]);
    const removeVideo = (id) => {
        if (videosList.length > 1) {
            setVideosList(videosList.filter(v => v.id !== id));
        }
    };
    const updateVideo = (id, field, value) => {
        setVideosList(videosList.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const addResource = () => setResourcesList([...resourcesList, { id: Date.now().toString(), title: '', type: 'pdf', file: null }]);
    const removeResource = (id) => setResourcesList(resourcesList.filter(r => r.id !== id));
    const updateResource = (id, field, value) => {
        setResourcesList(resourcesList.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    useEffect(() => {
        const fetchMentorCourses = async () => {
            if (user) {
                try {
                    const mentorCourses = await courseService.getCoursesByInstructor(user.name);
                    setCourses(mentorCourses);
                } catch (error) {
                    console.error('Error fetching mentor courses:', error);
                }
            }
        };
        fetchMentorCourses();
    }, [user]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const handleFeatureNote = (feature) => {
        alert(`${feature} feature coming soon!`);
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        if (!user) return;
        
        // Validation
        const validVideos = videosList.filter(v => v.title && v.file);
        if (validVideos.length === 0) {
            alert('At least one associated video file with a title is required.');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload dependencies
            let thumbnailUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'; // default
            if (thumbnailFile) {
                const uploadedUrl = await courseService.uploadFile(thumbnailFile);
                thumbnailUrl = `http://localhost:5000${uploadedUrl}`;
            }

            // Upload videos
            const uploadedVideos = await Promise.all(validVideos.map(async (v, index) => {
                const videoUrlPath = await courseService.uploadFile(v.file);
                const videoUrlFull = `http://localhost:5000${videoUrlPath}`;
                return {
                    id: `v${Date.now()}-${index}`,
                    title: v.title,
                    url: videoUrlFull,
                    duration: '10:00', // Extract dynamically in a real app
                    isCompleted: false
                };
            }));

            // Upload resources
            const validResources = resourcesList.filter(r => r.title && r.file);
            const uploadedResources = await Promise.all(validResources.map(async (r, index) => {
                const resPath = await courseService.uploadFile(r.file);
                const resourceUrlFull = `http://localhost:5000${resPath}`;
                return {
                    id: `r${Date.now()}-${index}`,
                    title: r.title,
                    type: r.type,
                    url: resourceUrlFull
                };
            }));

            // 2. Prepare course payload
            const courseData = {
                title: newCourse.title,
                category: newCourse.category,
                description: newCourse.description,
                instructor: user.name,
                price: newCourse.isFree ? 0 : Number(newCourse.price),
                isFree: newCourse.isFree,
                thumbnail: thumbnailUrl,
                videos: uploadedVideos,
                resources: uploadedResources
            };

            const created = await courseService.createCourse(courseData);
            setCourses(prev => [created, ...prev]);
            setIsCreateModalOpen(false);
            setNewCourse({
                title: '',
                category: 'Beginner & Foundational (No/Low Coding)',
                description: '',
                price: '0',
                isFree: true
            });
            setVideosList([{ id: '1', title: 'Introduction', file: null }]);
            setResourcesList([{ id: '1', title: 'Syllabus', type: 'pdf', file: null }]);
            setThumbnailFile(null);
            alert('Course created successfully!');
        } catch (error) {
            alert(error.message || 'Failed to create course');
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = [
        'Beginner & Foundational (No/Low Coding)',
        'Technical & Intermediate (Coding/ML Focused)',
        'Data Analytics', 'UI/UX', 'Digital Marketing',
        'Cloud Computing', 'MERN Stack', 'MEAN Stack', 'Full Stack',
        'Front End', 'Back End', 'Prompt Engineering', 'Cyber Security',
        'Networking & IT Support', 'Network Administration'
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-8 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900">Mentor Hub</span>
                    </div>
                </div>

                <nav className="flex-grow p-6 space-y-2">
                    <button
                        onClick={() => navigate('/mentor/dashboard')}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold transition-all"
                    >
                        <Layout className="w-5 h-5" /> Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/catalog')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-all group"
                    >
                        <BookOpen className="w-5 h-5 group-hover:text-indigo-600 transition-colors" /> My Courses
                    </button>
                    <button
                        onClick={() => handleFeatureNote('Students')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-all group"
                    >
                        <Users className="w-5 h-5 group-hover:text-indigo-600 transition-colors" /> Students
                    </button>
                    <button
                        onClick={() => handleFeatureNote('Performance')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-all group"
                    >
                        <BarChart3 className="w-5 h-5 group-hover:text-indigo-600 transition-colors" /> Performance
                    </button>
                </nav>

                <div className="p-6 border-t border-slate-100 space-y-2">
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-all group"
                    >
                        <Settings className="w-5 h-5 group-hover:text-indigo-600 transition-colors" /> Settings
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl font-bold transition-all"
                    >
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow min-h-screen">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-8 flex items-center justify-between">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleFeatureNote('Notifications')}
                            className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl border border-slate-200 transition-all relative"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-10 w-[1px] bg-slate-200 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || 'Mentor'}</p>
                                <p className="text-[10px] font-medium text-indigo-600 uppercase tracking-widest">
                                    {user?.role === 'admin' ? 'Administrator' : 'Senior Mentor'}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold uppercase transition-transform hover:scale-105 cursor-pointer" onClick={() => navigate('/profile')}>
                                {user?.name?.charAt(0) || 'M'}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    {/* Welcome Section */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Mentor'}!</h1>
                            <p className="text-slate-500 font-medium">Here's what's happening with your students today.</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-200 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Create New Course
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Students', value: courses.reduce((acc, c) => acc + c.students, 0).toLocaleString(), icon: Users, trend: 'Overall', color: 'blue' },
                            { label: 'Active Courses', value: courses.length.toString(), icon: BookOpen, trend: 'Live', color: 'indigo' },
                            { label: 'Avg Course Price', value: `₹${(courses.reduce((acc, c) => acc + c.price, 0) / (courses.length || 1)).toFixed(0)}`, icon: BarChart3, trend: 'Revenue', color: 'emerald' },
                            { label: 'Average Rating', value: courses.length > 0 ? (courses.reduce((acc, c) => acc + c.rating, 0) / courses.length).toFixed(1) : 'N/A', icon: Star, trend: 'Quality', color: 'amber' }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">{stat.trend}</span>
                                </div>
                                <p className="text-3xl font-black text-slate-900 leading-none mb-1">{stat.value}</p>
                                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Main Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Course Performance */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Courses</h3>
                                    <button
                                        onClick={() => navigate('/catalog')}
                                        className="text-sm font-bold text-indigo-600 hover:underline"
                                    >
                                        View all
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {courses.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                                                <BookOpen className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-500 font-medium">No active courses yet</p>
                                            <p className="text-xs text-slate-400 mt-1">Start by creating your first course!</p>
                                        </div>
                                    ) : (
                                        courses.map((course, idx) => (
                                            <div
                                                key={course.id}
                                                onClick={() => navigate(`/course/${course.id}`)}
                                                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group cursor-pointer"
                                            >
                                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform overflow-hidden">
                                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className="text-sm font-bold text-slate-900">{course.title}</h4>
                                                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                                        <span>{course.students} Students</span>
                                                        <span>•</span>
                                                        <span>{course.isFree ? 'FREE' : `₹${course.price}`}</span>
                                                    </div>
                                                </div>
                                                <button className="p-2 text-slate-300 group-hover:text-indigo-600 transition-colors">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Reviews / Achievements */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
                                <Award className="w-12 h-12 mb-6" />
                                <h3 className="text-xl font-black tracking-tight mb-2">Mentor Level: {courses.length > 5 ? 'Senior' : courses.length > 0 ? 'Intermediate' : 'Newbie'}</h3>
                                <p className="text-indigo-100 text-sm font-medium mb-6 leading-relaxed">
                                    {courses.length === 0 ? 'Create your first course to start your journey!' : `You have created ${courses.length} courses. Keep it up!`}
                                </p>
                                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${Math.min(courses.length * 20, 100)}%` }}></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-100">
                                    <span>{courses.length} Courses</span>
                                    <span>5 Target</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                                <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">Recent Feedback</h3>
                                <div className="space-y-4">
                                    <div className="text-center py-8">
                                        <Star className="w-8 h-8 text-slate-100 mx-auto mb-3" />
                                        <p className="text-sm text-slate-400 font-medium italic">No feedback received yet.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Create Course Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Create New Course</h2>
                                <p className="text-slate-500 text-sm font-medium">Fill in the details to launch your course.</p>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-900"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCourse} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Course Title</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                        value={newCourse.title}
                                        onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                                        value={newCourse.category}
                                        onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Course Type</label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setNewCourse({ ...newCourse, isFree: true, price: '0' })}
                                            className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-all ${newCourse.isFree ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200'}`}
                                        >
                                            Free
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewCourse({ ...newCourse, isFree: false })}
                                            className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-all ${!newCourse.isFree ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200'}`}
                                        >
                                            Paid
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                        Course Price {newCourse.isFree ? '(Free Course)' : '(INR)'}
                                    </label>
                                    <input
                                        disabled={newCourse.isFree}
                                        type="number"
                                        className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium ${newCourse.isFree ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        value={newCourse.price}
                                        onChange={e => setNewCourse({ ...newCourse, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium resize-none"
                                    value={newCourse.description}
                                    onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Course Videos</h3>
                                    <button 
                                        type="button" 
                                        onClick={addVideo}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" /> Add Video
                                    </button>
                                </div>
                                
                                {videosList.map((video, index) => (
                                    <div key={video.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 relative">
                                        {videosList.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => removeVideo(video.id)}
                                                className="absolute top-4 right-4 text-slate-400 hover:text-rose-500"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Video Title</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-sm"
                                                    value={video.title}
                                                    onChange={e => updateVideo(video.id, 'title', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                    <Video className="w-3 h-3" /> Video File (Required)
                                                </label>
                                                <input
                                                    required
                                                    type="file"
                                                    accept="video/*"
                                                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                                    onChange={e => updateVideo(video.id, 'file', e.target.files ? e.target.files[0] : null)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Course Resources (Optional)</h3>
                                    <button 
                                        type="button" 
                                        onClick={addResource}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" /> Add Resource
                                    </button>
                                </div>
                                
                                {resourcesList.map((resource, index) => (
                                    <div key={resource.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 relative">
                                        <button 
                                            type="button" 
                                            onClick={() => removeResource(resource.id)}
                                            className="absolute top-4 right-4 text-slate-400 hover:text-rose-500"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pr-8">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Resource Title</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-sm"
                                                    value={resource.title}
                                                    onChange={e => updateResource(resource.id, 'title', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Type</label>
                                                <select
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-sm"
                                                    value={resource.type}
                                                    onChange={e => updateResource(resource.id, 'type', e.target.value)}
                                                >
                                                    <option value="pdf">PDF</option>
                                                    <option value="zip">ZIP</option>
                                                    <option value="link">Link</option>
                                                    <option value="video">Video</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                                    <FileText className="w-3 h-3" /> File
                                                </label>
                                                <input
                                                    type="file"
                                                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                                    onChange={e => updateResource(resource.id, 'file', e.target.files ? e.target.files[0] : null)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Course Thumbnail Image (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                    onChange={e => setThumbnailFile(e.target.files ? e.target.files[0] : null)}
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-grow py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isSubmitting ? 'Uploading...' : 'Launch Course'}
                                </button>
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-8 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-sm disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorDashboard;
