import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, LogIn, Settings } from 'lucide-react';
import authService, { UnverifiedError } from '../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [role, setRole] = useState('student');

    // Check if there's a redirected message (e.g., from registration or verification)
    const [successMessage, setSuccessMessage] = useState(
        (location.state)?.message || null
    );

    useEffect(() => {
        // Clear success message after 5 seconds
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.login(formData);

            // Handle remember me if needed
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Redirect based on role
            if (response.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else if (response.role === 'mentor') {
                navigate('/mentor/dashboard', { replace: true });
            } else {
                const from = (location.state)?.from?.pathname || '/';
                navigate(from, { replace: true });
            }
        } catch (err) {
            if (err instanceof UnverifiedError) {
                // If unverified, redirect to verification page
                navigate('/verify-email', { state: { email: formData.email } });
            } else {
                setError(err.message || 'Invalid email or password. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className={`absolute -top-24 -left-24 w-96 h-96 ${role === 'student' ? 'bg-emerald-100' : role === 'mentor' ? 'bg-indigo-100' : 'bg-rose-100'} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob`}></div>
                <div className={`absolute -bottom-24 -right-24 w-96 h-96 ${role === 'student' ? 'bg-teal-100' : role === 'mentor' ? 'bg-blue-100' : 'bg-orange-100'} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000`}></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                {/* Logo & Header */}
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-2 group mb-6">
                        <div className={`w-12 h-12 ${role === 'student' ? 'bg-emerald-600 shadow-emerald-200' : role === 'mentor' ? 'bg-indigo-600 shadow-indigo-200' : 'bg-rose-600 shadow-rose-200'} rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3`}>
                            <LogIn className="w-6 h-6" />
                        </div>
                        <span className={`text-3xl font-black tracking-tighter bg-gradient-to-r ${role === 'student' ? 'from-emerald-600 to-teal-600' : role === 'mentor' ? 'from-indigo-600 to-blue-600' : 'from-rose-600 to-orange-600'} bg-clip-text text-transparent`}>
                            SeedIt
                        </span>
                    </Link>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back!</h2>
                    <p className="mt-2 text-slate-500">
                        {role === 'student' ? 'Continue your learning journey today.' : role === 'mentor' ? 'Manage your classes and inspire students.' : 'Full control over the platform and users.'}
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white p-8 sm:p-10 relative overflow-hidden">
                    {/* Role Toggle */}
                    <div className="flex p-1.5 bg-slate-100/50 rounded-2xl mb-8 border border-slate-200/50">
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${role === 'student' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LogIn className="w-3.5 h-3.5" /> Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('mentor')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${role === 'mentor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Loader2 className="w-3.5 h-3.5" /> Mentor
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('admin')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${role === 'admin' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Settings className="w-3.5 h-3.5" /> Admin
                        </button>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-shake">
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-red-600 text-xs font-bold">!</span>
                            </div>
                            <p className="text-sm text-red-600 font-medium leading-tight">{error}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 animate-fade-in">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-emerald-600 text-xs font-bold">✓</span>
                            </div>
                            <p className="text-sm text-emerald-600 font-medium leading-tight">{successMessage}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                                    {role === 'admin' ? 'Username' : 'Email Address'}
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type={role === 'admin' ? 'text' : 'email'}
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${role === 'student' ? 'focus:ring-emerald-500/20 focus:border-emerald-500' : role === 'mentor' ? 'focus:ring-indigo-500/20 focus:border-indigo-500' : 'focus:ring-rose-500/20 focus:border-rose-500'} transition-all duration-300`}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Password</label>
                                    <a href="#/forgot-password" title="Forgot Password" id="forgot-password-link" className={`text-xs font-black uppercase tracking-[0.2em] ${role === 'student' ? 'text-emerald-600 hover:text-emerald-500' : role === 'mentor' ? 'text-indigo-600 hover:text-indigo-500' : 'text-rose-600 hover:text-rose-500'} transition-colors`}>Forgot?</a>
                                </div>
                                <div className="relative group">
                                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 ${role === 'student' ? 'group-focus-within:text-emerald-500' : role === 'mentor' ? 'group-focus-within:text-indigo-500' : role === 'student' ? 'group-focus-within:text-rose-500' : 'group-focus-within:text-rose-500'} transition-colors`}>
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`block w-full pl-11 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${role === 'student' ? 'focus:ring-emerald-500/20 focus:border-emerald-500' : role === 'mentor' ? 'focus:ring-indigo-500/20 focus:border-indigo-500' : 'focus:ring-rose-500/20 focus:border-rose-500'} transition-all duration-300`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center ml-1">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className={`h-4 w-4 ${role === 'student' ? 'text-emerald-600 focus:ring-emerald-500' : role === 'mentor' ? 'text-indigo-600 focus:ring-indigo-500' : 'text-rose-600 focus:ring-rose-500'} border-slate-300 rounded-lg cursor-pointer transition-colors`}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-600 cursor-pointer select-none">
                                Remember me
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white ${role === 'student' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-200 focus:ring-emerald-500' : role === 'mentor' ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-200 focus:ring-indigo-500' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-200 focus:ring-rose-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Link */}
                <p className="text-center text-sm font-medium text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/register" className={`font-bold transition-colors ${role === 'student' ? 'text-emerald-600 hover:text-emerald-700' : role === 'mentor' ? 'text-indigo-600 hover:text-indigo-700' : 'text-rose-600 hover:text-rose-700'}`}>
                        Create one for free
                    </Link>
                </p>
            </div>

            {/* Global Styles for Animations */}
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
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}} />
        </div>
    );
};

export default Login;
