import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Layout,
    Users,
    BookOpen,
    Settings,
    LogOut,
    Search,
    Bell,
    ChevronRight,
    Star,
    Award,
    TrendingUp,
    DollarSign,
    MoreVertical,
    CheckCircle2,
    Clock,
    UserCheck,
    AlertCircle
} from 'lucide-react';
import authService from '../services/authService';
import { COURSES } from '../data/courses';

import adminService from '../services/adminService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(authService.getStoredUser());
    const [activeTab, setActiveTab] = useState('overview');
    const [pendingPayments, setPendingPayments] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [statsData, setStatsData] = useState({
        revenue: 0,
        studentCount: 0,
        courseCount: 0,
        mentorCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const [upiSettings, setUpiSettings] = useState({
        upiId: localStorage.getItem('platform_upi_id') || 'yourname@oksbi',
        payeeName: localStorage.getItem('platform_payee_name') || 'yourname'
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || 'Learner at Seedit E-Learning Platform',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [users, stats, payments, notices] = await Promise.all([
                    adminService.getAllUsers(),
                    adminService.getStats(),
                    adminService.getPendingPayments(),
                    adminService.getNotifications()
                ]);
                setAllUsers(users);
                setStatsData(stats);
                setPendingPayments(payments);
                setNotifications(notices);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        
        // Refresh notifications every minute
        const interval = setInterval(async () => {
            try {
                const notices = await adminService.getNotifications();
                setNotifications(notices);
            } catch (err) {
                console.error("Failed to refresh notices");
            }
        }, 60000);
        
        return () => clearInterval(interval);
    }, []);

    const handleApprovePayment = async (paymentId) => {
        try {
            await adminService.verifyPayment(paymentId, 'approved');
            setPendingPayments(prev => prev.filter(p => p._id !== paymentId));
            alert("Payment Approved! Course access has been granted.");
        } catch (error) {
            alert("Failed to approve payment");
        }
    };

    const handleRejectPayment = async (paymentId) => {
        try {
            await adminService.verifyPayment(paymentId, 'rejected');
            setPendingPayments(prev => prev.filter(p => p._id !== paymentId));
            alert("Payment Rejected.");
        } catch (error) {
            alert("Failed to reject payment");
        }
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        setIsSaving(true);

        localStorage.setItem('platform_upi_id', upiSettings.upiId);
        localStorage.setItem('platform_payee_name', upiSettings.payeeName);

        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 1000);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const updated = await authService.updateUser({ name: profileData.name });
            setUser(authService.getStoredUser());
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            alert("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const handleMarkAllRead = async () => {
        try {
            await adminService.markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all as read");
        }
    };

    const handleNotificationClick = async (notif) => {
        try {
            if (!notif.isRead) {
                await adminService.markNotificationAsRead(notif._id);
                setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
            }
            if (notif.type === 'payment') {
                setActiveTab('payments');
            }
            setShowNotifications(false);
        } catch (error) {
            console.error("Failed to handle notification click");
        }
    };

    const statsOverview = [
        {
            label: 'Total Revenue',
            value: `₹${statsData.revenue.toLocaleString()}`,
            icon: DollarSign,
            trend: 'Live',
            color: 'rose'
        },
        {
            label: 'Active Students',
            value: statsData.studentCount.toString(),
            icon: Users,
            trend: 'Live',
            color: 'emerald'
        },
        {
            label: 'Total Courses',
            value: statsData.courseCount.toString(),
            icon: BookOpen,
            trend: 'Active',
            color: 'blue'
        },
        {
            label: 'Expert Mentors',
            value: statsData.mentorCount.toString(),
            icon: Award,
            trend: 'Verified',
            color: 'amber'
        }
    ];

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold">Initializing System Root...</div>;


    const renderOverview = () => (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsOverview.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-[10px] font-black tracking-widest uppercase ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-3xl font-black text-slate-900 leading-none mb-1">{stat.value}</p>
                        <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900">Recent Enrolled Students</h3>
                        <button className="text-sm font-bold text-rose-600 hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {allUsers.filter(u => u.role === 'student').slice(-3).reverse().map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                                    {item.name.charAt(0)}
                                </div>
                                <div className="flex-grow">
                                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                                    <p className="text-xs text-slate-400 font-medium">{item.email} • Joined Recently</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.isVerified ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {item.isVerified ? 'Verified' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {allUsers.filter(u => u.role === 'student').length === 0 && (
                            <p className="text-center py-10 text-slate-400 font-medium">No students registered yet.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                    <h3 className="text-xl font-black text-slate-900 mb-8">System Health</h3>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Payment Gateway</p>
                                <p className="text-xs text-slate-500">Operational • 99.9% Uptime</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Email System</p>
                                <p className="text-xs text-slate-500">Connected to EmailJS</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">New Mentor Apps</p>
                                <p className="text-xs text-slate-500">3 applications pending review</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCourses = () => (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Course Management</h3>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-200 transition-all">Filter</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Course Name</th>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Mentor</th>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Students</th>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Price</th>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[
                            { name: 'AI for Everyone', mentor: 'Dr. Sarah', students: 1240, price: '₹49.99', status: 'Live' },
                            { name: 'Advanced React', mentor: 'John Doe', students: 852, price: '₹59.99', status: 'Live' },
                            { name: 'UI/UX Design', mentor: 'Jane Smith', students: 642, price: 'Free', status: 'Draft' }
                        ].map((course, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-5">
                                    <p className="text-sm font-bold text-slate-900">{course.name}</p>
                                </td>
                                <td className="px-8 py-5 text-sm text-slate-500 font-medium">{course.mentor}</td>
                                <td className="px-8 py-5 text-sm text-slate-500 font-medium">{course.students}</td>
                                <td className="px-8 py-5 text-sm text-slate-700 font-black">{course.price}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${course.status === 'Live' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {course.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderStudents = () => (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Registered Students</h3>
                <div className="flex gap-2">
                    <span className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-sm font-bold">
                        {allUsers.filter(u => u.role === 'student').length} Total
                    </span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Name</th>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Email</th>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {allUsers.filter(u => u.role === 'student').map((student, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
                                            {student.name.charAt(0)}
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">{student.name}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-sm text-slate-500 font-medium">{student.email}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${student.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {student.isVerified ? 'Verified' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-xs text-slate-400 font-mono">{student._id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderMentors = () => (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Mentor Network</h3>
                <div className="flex gap-2">
                    <span className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-sm font-bold">
                        {allUsers.filter(u => u.role === 'mentor').length} Total
                    </span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Name</th>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Email</th>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Expertise</th>
                            <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {allUsers.filter(u => u.role === 'mentor').map((mentor, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center font-bold text-xs">
                                            {mentor.name.charAt(0)}
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">{mentor.name}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-sm text-slate-500 font-medium">{mentor.email}</td>
                                <td className="px-8 py-5">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                                        Expert
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-xs text-slate-400 font-mono">{mentor._id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="max-w-2xl">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 sm:p-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900">Payment Configuration</h3>
                        <p className="text-sm text-slate-500 font-medium">Configure where enrollment money is received.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Platform UPI ID</label>
                                <input
                                    type="text"
                                    value={upiSettings.upiId}
                                    onChange={(e) => setUpiSettings(prev => ({ ...prev, upiId: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all text-sm font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Payee Name</label>
                                <input
                                    type="text"
                                    value={upiSettings.payeeName}
                                    onChange={(e) => setUpiSettings(prev => ({ ...prev, payeeName: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all text-sm font-bold"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 text-amber-700">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-[10px] font-medium leading-relaxed">
                                Settings update the global checkout. Ensure the UPI ID is correct to avoid payment failures.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm text-white transition-all shadow-lg ${saveSuccess ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-200'}`}
                        >
                            {isSaving ? 'Updating...' : saveSuccess ? 'Settings Saved!' : 'Save Configuration'}
                        </button>
                    </form>

                    <div className="flex flex-col items-center justify-center space-y-4 bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Active QR Code</p>
                        <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <img
                                src="/assets/upi-qr.png"
                                alt="Admin UPI QR"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=asina200107@oksbi';
                                }}
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold italic text-center">This image is shown to students during checkout.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPayments = () => (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-slate-900">Pending Approvals</h3>
                    <p className="text-sm text-slate-500 font-medium">Verify UTRs against your bank statement.</p>
                </div>
                <div className="flex gap-2 text-rose-600 font-bold text-sm bg-rose-50 px-4 py-2 rounded-xl">
                    {pendingPayments.length} Active Requests
                </div>
            </div>

            {pendingPayments.length === 0 ? (
                <div className="p-20 text-center">
                    <CheckCircle2 className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No pending payments to verify.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Student</th>
                                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Course</th>
                                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">UTR / ID</th>
                                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Amount</th>
                                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pendingPayments.map((payment) => (
                                <tr key={payment._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-bold text-slate-900">{payment.userName}</p>
                                        <span className="text-[10px] text-slate-400">{new Date(payment.createdAt).toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-slate-500 font-medium">{payment.courseTitle}</td>
                                    <td className="px-8 py-5">
                                        <code className="bg-slate-100 px-3 py-1 rounded text-xs font-black text-slate-700 tracking-widest">
                                            {payment.utr}
                                        </code>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-black text-slate-900">₹{payment.amount}</td>
                                    <td className="px-8 py-5 text-right space-x-2">
                                        <button
                                            onClick={() => handleApprovePayment(payment._id)}
                                            className="px-4 py-2 bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectPayment(payment._id)}
                                            className="px-4 py-2 bg-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderProfile = () => (
        <div className="max-w-4xl">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 sm:p-10">
                <div className="flex flex-col md:flex-row gap-12">
                    <div className="w-full md:w-1/3 flex flex-col items-center">
                        <div className="w-40 h-40 bg-gradient-to-br from-rose-500 to-orange-500 rounded-[2.5rem] border-[6px] border-white shadow-2xl flex items-center justify-center text-white font-black text-6xl mb-6">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <h3 className="text-xl font-black text-slate-900">{user?.name}</h3>
                        <p className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-4">{user?.role}</p>
                        <div className="px-6 py-2 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            ID: {user?._id?.substring(0, 8)}...
                        </div>
                    </div>

                    <div className="flex-grow">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                                <UserCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Admin Identity</h3>
                                <p className="text-sm text-slate-500 font-medium">Manage your system root credentials.</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all text-sm font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        disabled
                                        className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">System Bio</label>
                                <textarea
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all text-sm font-bold min-h-[120px]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm text-white transition-all shadow-lg ${saveSuccess ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-200'}`}
                            >
                                {isSaving ? 'Updating...' : saveSuccess ? 'Profile Updated!' : 'Update Identity'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-80 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-8 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-100 animate-pulse-slow">
                            <Settings className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tight text-slate-900 block leading-tight">Admin Console</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">System Root</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-grow p-6 space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'overview' ? 'bg-rose-50 text-rose-600 shadow-sm shadow-rose-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Layout className="w-5 h-5" /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'courses' ? 'bg-rose-50 text-rose-600 shadow-sm shadow-rose-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <BookOpen className="w-5 h-5" /> Courses
                    </button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'students' ? 'bg-rose-50 text-rose-600 shadow-sm shadow-rose-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Users className="w-5 h-5" /> Students
                    </button>
                    <button
                        onClick={() => setActiveTab('mentors')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'mentors' ? 'bg-rose-50 text-rose-600 shadow-sm shadow-rose-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <UserCheck className="w-5 h-5" /> Mentors
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-rose-50 text-rose-600 shadow-sm shadow-rose-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Settings className="w-5 h-5" /> Payment Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'payments' ? 'bg-rose-50 text-rose-600 shadow-sm shadow-rose-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <DollarSign className="w-5 h-5" /> Pending Payments
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-rose-50 text-rose-600 shadow-sm shadow-rose-100/50' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <UserCheck className="w-5 h-5" /> Admin Profile
                    </button>

                </nav>

                <div className="p-6 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-4 text-rose-500 hover:bg-rose-50 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border border-transparent hover:border-rose-100"
                    >
                        <LogOut className="w-5 h-5" /> Logout Session
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow min-h-screen">
                {/* Header */}
                <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Administrator Control Panel</h2>
                        <h1 className="text-2xl font-black text-slate-900 capitalize tracking-tight">{activeTab}</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden xl:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                className="w-80 pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-300 transition-all font-medium"
                            />
                        </div>

                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-3 rounded-2xl border transition-all relative group ${showNotifications ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-rose-600'}`}
                            >
                                <Bell className={`w-5 h-5 ${notifications.some(n => !n.isRead) ? 'group-hover:animate-ring' : ''}`} />
                                {notifications.some(n => !n.isRead) && (
                                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-50">
                                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                        <h3 className="text-sm font-black text-slate-900">Notifications</h3>
                                        <button 
                                            onClick={handleMarkAllRead}
                                            className="text-[10px] font-black uppercase tracking-widest text-rose-600 hover:underline"
                                        >
                                            Mark all read
                                        </button>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-10 text-center">
                                                <Bell className="w-10 h-10 text-slate-100 mx-auto mb-3" />
                                                <p className="text-xs text-slate-400 font-medium">System reports all clear.</p>
                                            </div>
                                        ) : (
                                            notifications.map((notif) => (
                                                <div 
                                                    key={notif._id} 
                                                    onClick={() => handleNotificationClick(notif)}
                                                    className={`p-4 border-b border-slate-50 flex items-start gap-4 cursor-pointer transition-colors ${notif.isRead ? 'opacity-60 grayscale-[0.5]' : 'bg-slate-50/50 hover:bg-slate-50'}`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.type === 'payment' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                        {notif.type === 'payment' ? <DollarSign className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1">{notif.title}</h4>
                                                        <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{notif.message}</p>
                                                        <span className="text-[10px] text-slate-400 mt-2 block font-medium">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                                                    </div>
                                                    {!notif.isRead && <div className="w-2 h-2 bg-rose-500 rounded-full flex-shrink-0 mt-1.5"></div>}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-4 bg-slate-50 text-center">
                                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">
                                            Clear Audit Log
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                            <div className="h-10 w-[1px] bg-slate-200 mx-2"></div>
                            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveTab('profile')}>
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-black text-slate-900 leading-tight group-hover:text-rose-600 transition-colors">{user?.name || 'Admin'}</p>
                                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{user?.role || 'Master Access'}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-xl group-hover:scale-105 transition-transform">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                            </div>
                        </div>
                </header>

                <div className="p-10">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'courses' && renderCourses()}
                    {activeTab === 'students' && renderStudents()}
                    {activeTab === 'mentors' && renderMentors()}
                    {activeTab === 'settings' && renderSettings()}
                    {activeTab === 'payments' && renderPayments()}
                    {activeTab === 'profile' && renderProfile()}
                </div>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes ring {
                    0% { transform: rotate(0); }
                    10% { transform: rotate(15deg); }
                    20% { transform: rotate(-15deg); }
                    30% { transform: rotate(10deg); }
                    40% { transform: rotate(-10deg); }
                    50% { transform: rotate(0); }
                    100% { transform: rotate(0); }
                }
                .group-hover\\:animate-ring {
                    animation: ring 1s ease-in-out infinite;
                }
                .animate-pulse-slow {
                    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .7; }
                }
            `}} />
        </div>
    );
};

const handleFeatureNote = (feature) => {
    alert(`${feature} feature coming soon!`);
};

export default AdminDashboard;
