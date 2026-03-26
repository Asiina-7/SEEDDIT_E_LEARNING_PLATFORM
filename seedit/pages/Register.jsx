import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import authService from '../services/authService';

const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [role, setRole] = useState('student');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await authService.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: role
            });

            // Redirect to verification
            navigate('/verify-email', {
                state: { email: formData.email }
            });
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className={`absolute -top-24 -right-24 w-96 h-96 ${role === 'student' ? 'bg-emerald-100' : 'bg-indigo-100'} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob`}></div>
                <div className={`absolute -bottom-24 -left-24 w-96 h-96 ${role === 'student' ? 'bg-teal-100' : 'bg-blue-100'} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000`}></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-2 group mb-6">
                        <div className={`w-12 h-12 ${role === 'student' ? 'bg-emerald-600 shadow-emerald-200' : 'bg-indigo-600 shadow-indigo-200'} rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3`}>
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <span className={`text-3xl font-black tracking-tighter bg-gradient-to-r ${role === 'student' ? 'from-emerald-600 to-teal-600' : 'from-indigo-600 to-blue-600'} bg-clip-text text-transparent`}>
                            SeedIt
                        </span>
                    </Link>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create your account</h2>
                    <p className="mt-2 text-slate-500">
                        {role === 'student' ? 'Join our community of learners today.' : 'Share your knowledge and mentor students.'}
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white p-8 sm:p-10 relative overflow-hidden">
                    {/* Role Toggle */}
                    <div className="flex p-1.5 bg-slate-100/50 rounded-2xl mb-8 border border-slate-200/50">
                        <button
                            onClick={() => setRole('student')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${role === 'student' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <User className="w-3.5 h-3.5" /> Student
                        </button>
                        <button
                            onClick={() => setRole('mentor')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${role === 'mentor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <UserPlus className="w-3.5 h-3.5" /> Mentor
                        </button>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-shake">
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-red-600 text-xs font-bold">!</span>
                            </div>
                            <p className="text-sm text-red-600 font-medium leading-tight">{error}</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Name Field */}
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 ${role === 'student' ? 'group-focus-within:text-emerald-500' : 'group-focus-within:text-indigo-500'} transition-colors`}>
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${role === 'student' ? 'focus:ring-emerald-500/20 focus:border-emerald-500' : 'focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all duration-300`}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 ${role === 'student' ? 'group-focus-within:text-emerald-500' : 'group-focus-within:text-indigo-500'} transition-colors`}>
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${role === 'student' ? 'focus:ring-emerald-500/20 focus:border-emerald-500' : 'focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all duration-300`}
                                />
                            </div>
                        </div>

                        {/* Password Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 ${role === 'student' ? 'group-focus-within:text-emerald-500' : 'group-focus-within:text-indigo-500'} transition-colors`}>
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`block w-full pl-11 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${role === 'student' ? 'focus:ring-emerald-500/20 focus:border-emerald-500' : 'focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all duration-300`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 ml-1">
                                    Confirm
                                </label>
                                <div className="relative group">
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 ${role === 'student' ? 'group-focus-within:text-emerald-500' : 'group-focus-within:text-indigo-500'} transition-colors`}>
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${role === 'student' ? 'focus:ring-emerald-500/20 focus:border-emerald-500' : 'focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all duration-300`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white ${role === 'student' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-200 focus:ring-emerald-500' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-200 focus:ring-indigo-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg mt-2`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Link */}
                <p className="text-center text-sm font-medium text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className={`font-bold transition-colors ${role === 'student' ? 'text-emerald-600 hover:text-emerald-700' : 'text-indigo-600 hover:text-indigo-700'}`}>
                        Sign in instead
                    </Link>
                </p>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
            `}} />
        </div>
    );
};

export default Register;
