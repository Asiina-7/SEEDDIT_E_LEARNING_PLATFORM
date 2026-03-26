import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import { getAITutorResponse } from '../services/ai-tutor';
import Certificate from '../components/Certificate';
import Quiz from '../components/Quiz';
import { getQuizForCourse } from '../data/quizzes';
import progressService from '../services/progressService';
import authService from '../services/authService';
import confetti from 'canvas-confetti';

const LearningSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedVideoIds, setCompletedVideoIds] = useState([]);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [activeTab, setActiveTab] = useState('curriculum');

  // AI Chat state
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const initSession = async () => {
      if (!id) return;
      try {
        const found = await courseService.getCourseById(id);
        if (!found) {
          navigate('/catalog');
          return;
        }
        setCourse(found);
        setCurrentVideo(found.videos[0]);

        // Load progress from backend
        try {
          const data = await progressService.getCourseProgress(found.id);
          if (data) {
            const completedIds = data.completedVideos.map((v) => v.videoId);
            setCompletedVideoIds(completedIds);
            setQuizPassed(data.quizPassed);
          }
        } catch (error) {
          console.error("Failed to load progress", error);
        }
      } catch (error) {
        console.error("Failed to load course", error);
        navigate('/catalog');
      }
    };
    initSession();
  }, [id, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleVideoComplete = async () => {
    if (!currentVideo || !course) return;

    if (!completedVideoIds.includes(currentVideo.id)) {
      const newCompleted = [...completedVideoIds, currentVideo.id];
      setCompletedVideoIds(newCompleted);

      try {
        await progressService.updateProgress({
          courseId: course.id,
          videoId: currentVideo.id
        });
      } catch (error) {
        console.error("Failed to sync progress", error);
      }

      // Check if all videos done
      if (newCompleted.length === course.videos.length) {
        if (!quizPassed) {
          setShowQuiz(true);
        } else {
          setShowCertificate(true);
          
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#34d399', '#6ee7b7']
          });
        }
      }
    }

    // Auto-advance
    const currentIndex = course.videos.findIndex(v => v.id === currentVideo.id);
    if (currentIndex < course.videos.length - 1) {
      setCurrentVideo(course.videos[currentIndex + 1]);
    }
  };

  const handleQuizComplete = async (score) => {
    setQuizPassed(true);
    setShowQuiz(false);
    setShowCertificate(true);

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7']
    });

    try {
      await progressService.updateProgress({
        courseId: course?.id || '',
        quizPassed: true,
        quizScore: score
      });
    } catch (error) {
      console.error("Failed to sync quiz results", error);
    }
  };

  const handleSummarizeLesson = async () => {
    setIsTyping(true);
    const summaryPrompt = `Please summarize the key points of the lesson "${currentVideo?.title}" from the course "${course?.title}". 
    Format it as a concise bulleted list.`;

    try {
      const response = await getAITutorResponse(summaryPrompt, "Summarization Task");
      setMessages(prev => [...prev, { role: 'ai', text: `### Lesson Summary\n\n${response}` }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Failed to generate summary. I'm still learning about this specific lesson!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    const context = `I am a student taking the course "${course?.title}". Currently, I am watching the lesson titled "${currentVideo?.title}". 
      Please provide helpful, encouraging, and accurate guidance. 
      Keep the tone like a personal mentor from SEEDIT E-Learning Platform. 
      Focus on clarifying the concepts explored in this Specific course.`;
    try {
      const aiResponse = await getAITutorResponse(userMsg, context);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setIsTyping(false);
  };

  if (!course) return <div className="p-12 text-center">Loading session...</div>;
  
  if (course.videos.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <i className="fas fa-video-slash text-3xl text-slate-500"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2">No Content Available</h2>
        <p className="text-slate-400 max-w-md mb-8">
          This course doesn't have any lessons uploaded yet. Please check back later or contact the instructor.
        </p>
        <button 
          onClick={() => navigate('/catalog')}
          className="px-6 py-2 bg-emerald-600 rounded-xl font-bold hover:bg-emerald-500 transition-colors"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  if (!currentVideo) return <div className="p-12 text-center">Initializing player...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="font-bold text-lg hidden sm:block">{course.title}</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${(completedVideoIds.length / course.videos.length) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-emerald-400">
              {completedVideoIds.length}/{course.videos.length} Lessons
            </span>
          </div>
          {completedVideoIds.length === course.videos.length && (
            <button
              onClick={() => quizPassed ? setShowCertificate(true) : setShowQuiz(true)}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-500 shadow-lg shadow-emerald-500/20"
            >
              {quizPassed ? 'Get Certificate' : 'Take Final Quiz'}
            </button>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 grid lg:grid-cols-[1fr_350px] overflow-hidden">
        <div className="flex flex-col overflow-y-auto">
          {/* Video Player Area */}
          <div className="aspect-video bg-black w-full relative">
            <video
              key={currentVideo.id}
              className="w-full h-full"
              controls
              onEnded={handleVideoComplete}
              autoPlay
            >
              <source src={currentVideo.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
                <p className="text-slate-400">Section 1 &bull; Lesson {course.videos.indexOf(currentVideo) + 1}</p>
              </div>
              <button onClick={handleVideoComplete} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors font-bold text-sm">
                Next Lesson <i className="fas fa-chevron-right"></i>
              </button>
            </div>

            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <h3 className="font-bold text-lg mb-4">Description</h3>
              <p className="text-slate-400 leading-relaxed">
                In this lesson, we dive deep into {currentVideo.title.toLowerCase()}. We will cover the core principles and see how these apply in real-world professional projects. Follow along with the code samples provided in the resources section.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Tabs (Lessons & AI Tutor) */}
        <div className="border-l border-white/10 bg-slate-900 flex flex-col h-full">
          <div className="p-2 flex gap-1 bg-slate-950/50">
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`flex-1 py-3 text-xs font-black tracking-widest uppercase border-b-2 transition-all ${activeTab === 'curriculum' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex-1 py-3 text-xs font-black tracking-widest uppercase border-b-2 transition-all ${activeTab === 'resources' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Resources
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'curriculum' ? (
              course.videos.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => setCurrentVideo(v)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${currentVideo.id === v.id ? 'bg-emerald-600/10 border-emerald-500/50 ring-1 ring-emerald-500/50' : 'bg-white/5 border-transparent hover:border-white/20'}`}
                >
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${completedVideoIds.includes(v.id) ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    {completedVideoIds.includes(v.id) ? <i className="fas fa-check text-[10px]"></i> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold mb-1 ${currentVideo.id === v.id ? 'text-emerald-400' : 'text-slate-100'}`}>{v.title}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span><i className="far fa-clock mr-1"></i> {v.duration}</span>
                      {completedVideoIds.includes(v.id) && <span className="text-emerald-500 font-bold uppercase tracking-widest">Completed</span>}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="space-y-3">
                {course.resources && course.resources.length > 0 ? (
                  course.resources.map(res => (
                    <a
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
                        {res.type === 'pdf' && <i className="far fa-file-pdf text-lg"></i>}
                        {res.type === 'zip' && <i className="far fa-file-archive text-lg"></i>}
                        {res.type === 'link' && <i className="fas fa-external-link-alt text-lg"></i>}
                        {res.type === 'video' && <i className="fas fa-play-circle text-lg"></i>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors truncate">{res.title}</h4>
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{res.type} Resource</span>
                      </div>
                      <i className="fas fa-download text-xs text-slate-600 group-hover:text-emerald-500 transition-colors"></i>
                    </a>
                  ))
                ) : (
                  <div className="text-center py-12 px-6">
                    <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <i className="fas fa-folder-open text-2xl text-slate-600"></i>
                    </div>
                    <h4 className="text-sm font-bold text-slate-300 mb-1">No Resources Yet</h4>
                    <p className="text-xs text-slate-500">Stay tuned! We'll be adding helpful materials for this course soon.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Tutor Chat Overlay/Panel */}
          <div className="h-1/2 border-t border-white/10 flex flex-col bg-slate-950">
            <div className="p-4 border-b border-white/10 flex items-center gap-2">
              <i className="fas fa-brain text-emerald-400"></i>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">AI Tutor</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scroll-hide">
              {messages.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p>Have a question about this lesson? Ask me anything!</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none animate-pulse">Thinking...</div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-slate-950">
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-xs"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-colors"
                >
                  <i className="fas fa-paper-plane text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="max-w-5xl w-full max-h-[90vh] overflow-y-auto scroll-hide">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowCertificate(false)}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <Certificate course={course} userName={authService.getStoredUser()?.name || "Student Professional"} date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
            <div className="mt-8 flex justify-center gap-4">
              <button className="px-8 py-3 bg-emerald-600 rounded-xl font-bold hover:bg-emerald-500 shadow-xl shadow-emerald-500/20" onClick={() => window.print()}>
                <i className="fas fa-download mr-2"></i> Download PDF
              </button>
              <button className="px-8 py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20">
                <i className="fab fa-linkedin mr-2"></i> <a href="https://www.linkedin.com/in/asina-perumal-19a66931b/" className="text-white">Share on LinkedIn</a>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="max-w-2xl w-full">
            <Quiz
              quiz={getQuizForCourse(id || 'default')}
              onComplete={handleQuizComplete}
              onCancel={() => setShowQuiz(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningSession;
