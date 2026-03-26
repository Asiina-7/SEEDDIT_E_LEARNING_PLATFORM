import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import { getAITutorResponse } from '../services/ai-tutor';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        const data = await courseService.getCourseById(id);
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (course) {
      const purchased = localStorage.getItem(`purchased_${course.id}`);
      if (purchased) setIsPurchased(true);
    }
  }, [course]);

  // AI Chat state
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) return <div className="p-12 text-center animate-pulse">Loading course details...</div>;
  if (!course) return <div className="p-12 text-center">Course not found.</div>;

  const handleEnroll = () => {
    if (course.isFree || isPurchased) {
      navigate(`/learn/${course.id}`);
    } else {
      navigate(`/payment/${course.id}`);
    }
  };


  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    const context = `Prospective student is looking at the course: ${course.title}. Category: ${course.category}. Description: ${course.description}. They want to know more before enrolling.`;
    const aiResponse = await getAITutorResponse(userMsg, context);
    setIsTyping(false);

    setMessages(prev => [
      ...prev,
      {
        role: 'ai',
        text: aiResponse || "I'm having a bit of trouble connecting to my knowledge base right now. This usually happens if I've been talking too much today (quota limit). Please try again later!"
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      {/* Course Hero */}
      <div className="bg-slate-900 text-white pt-16 pb-32 overflow-hidden relative">
        <div
          className="absolute inset-0 bg-emerald-950/20 will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <nav className="flex gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">
                <Link to="/catalog">Courses</Link>
                <span>/</span>
                <span className="text-slate-500">{course.category}</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">{course.title}</h1>
              <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                {course.description}
              </p>
              {/* Removed instructor, last updated, and rating details per user request */}
            </div>

            {/* Sticky Card */}
            <div className="relative lg:-mb-64 z-20">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="aspect-video relative group">
                  <img src={course.thumbnail} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl animate-pulse">
                      <i className="fas fa-play ml-1"></i>
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black text-slate-900">
                      {course.isFree ? 'FREE' : isPurchased ? 'OWNED' : `₹${course.price}`}
                    </span>
                    {!course.isFree && !isPurchased && <span className="text-slate-400 line-through text-xl">₹{(course.price * 1.5).toFixed(0)}</span>}
                  </div>
                  <button
                    onClick={handleEnroll}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-emerald-500/20 mb-4 hover:scale-[1.02] active:scale-95 uppercase tracking-widest text-sm"
                  >
                    {isPurchased || course.isFree ? 'Start Learning Now' : 'Buy Now & Enroll'}
                  </button>
                  <p className="text-center text-xs text-slate-400 font-medium">No hidden costs - Open for everyone</p>

                  <div className="mt-8 space-y-4">
                    <p className="font-black text-xs uppercase tracking-widest text-slate-800 border-b border-slate-100 pb-2">Includes</p>
                    <div className="grid gap-3">
                      {[
                        { icon: 'fa-infinity', text: 'Full lifetime access' },
                        { icon: 'fa-mobile-alt', text: 'Access on mobile and TV' },
                        { icon: 'fa-file-alt', text: `${course.videos.length} Downloadable resources` },
                        { icon: 'fa-certificate', text: `Official ${course.certificateType} Certificate` },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                          <i className={`fas ${item.icon} text-emerald-600 w-5`}></i>
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-[1fr_400px] gap-20">
          <div className="space-y-16">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <i className="fas fa-bullseye text-emerald-600"></i> What you'll learn
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 bg-slate-50 p-8 rounded-3xl">
                {[
                   'Master the core architecture of ' + course.category,
                  'Implement professional-grade projects',
                  'Gain deep insights into industry patterns',
                  'Optimize your workflow for efficiency',
                  'Earn a verified expert certification',
                  'Collaborate with fellow students'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-slate-700">
                    <i className="fas fa-check text-emerald-600 mt-1"></i>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Tutor Section */}
            <section className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                    <i className="fas fa-robot text-emerald-600"></i> Ask our AI Tutor
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Curious about the curriculum? Get instant answers from our AI assistant.</p>
                </div>
                <div className="hidden sm:block">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-8 h-8 rounded-full border-2 border-white" alt="Avatar" />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-600">+12k</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[400px]">
                <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-hide">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                        <i className="fas fa-comments text-2xl"></i>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">No questions yet</p>
                        <p className="text-xs text-slate-500">Ask about prerequisites, outcomes, or specific topics covered.</p>
                      </div>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200'}`}>
                        <p className="text-sm leading-relaxed">{m.text}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none animate-pulse text-sm text-slate-500">
                        <span className="flex items-center gap-2">
                          <i className="fas fa-circle-notch fa-spin text-emerald-600"></i>
                          AI is thinking...
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200">
                  <div className="relative group">
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-5 pr-14 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm transition-all"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isTyping || !chatInput.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/20"
                    >
                      <i className="fas fa-paper-plane text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <i className="fas fa-list-ul text-emerald-600"></i> Curriculum
              </h2>
              <div className="space-y-4">
                {course.videos.map((v, i) => (
                  <div key={v.id} className="group p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 group-hover:bg-emerald-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-emerald-600">
                        <i className="fas fa-play-circle"></i>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{v.title}</p>
                        <p className="text-xs text-slate-500">Video Lesson</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{v.duration}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CourseDetail;
