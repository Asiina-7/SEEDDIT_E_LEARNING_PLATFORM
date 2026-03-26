import React from 'react';
import authService from '../services/authService';

const Dashboard = () => {
    const user = authService.getStoredUser();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Please log in to view your dashboard</h2>
                    <a href="#/login" className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all">
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-white">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 border-4 border-white shadow-lg">
                            <i className="fas fa-user-circle text-5xl"></i>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome, {user.name}!</h1>
                            <p className="text-slate-500 text-lg">Manage your learning journey and explore new courses.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                            <h3 className="text-emerald-800 font-bold text-lg mb-2">Role</h3>
                            <p className="text-emerald-600 font-medium capitalize">{user.role || 'Student'}</p>
                        </div>
                        <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                            <h3 className="text-teal-800 font-bold text-lg mb-2">Email</h3>
                            <p className="text-teal-600 font-medium">{user.email}</p>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                            <h3 className="text-slate-800 font-bold text-lg mb-2">Status</h3>
                            <p className="text-slate-600 font-medium">Verified Account</p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Courses</h2>
                        <div className="bg-slate-100 rounded-2xl h-64 flex items-center justify-center border-2 border-dashed border-slate-300">
                            <div className="text-center text-slate-400">
                                <i className="fas fa-book-open text-4xl mb-4"></i>
                                <p>No courses enrolled yet. Explore the <a href="#/catalog" className="text-emerald-600 font-bold hover:underline">catalog</a>!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
