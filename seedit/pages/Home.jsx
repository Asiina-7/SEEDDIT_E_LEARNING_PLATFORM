import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { COURSES, TESTIMONIALS } from '../data/courses';

const Home = () => {
  const featuredCourses = COURSES.slice(0, 6);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="space-y-24 pb-24 overflow-x-hidden animate-fade-in">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-950">
        {/* Parallax Background Elements */}
        <div
          className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1 + scrollY * 0.2}px)` }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[120px] transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y + scrollY * -0.1}px)` }}
        ></div>

        <div
          className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/10 skew-x-12 translate-x-32 will-change-transform"
          style={{ transform: `skewX(12deg) translateX(${32 + scrollY * 0.1}px)` }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-in-left duration-1000">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 text-sm font-medium">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Join 500+ students today
              </div>
              <h1 className="text-5xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight">
                Plant the Seed of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 italic">Future Skills</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-lg font-medium leading-relaxed">
                The most comprehensive platform for AI, Cloud, and Full Stack development. Master the tools that shape tomorrow.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/catalog" className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-95">
                  Explore Courses
                </Link>
                <Link to="/contact" className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all backdrop-blur-md border border-white/10 active:scale-95 hover:scale-[1.02]">
                  Contact Support
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block animate-fade-in duration-1000 animation-delay-300">
              {/* Floating Decorative Elements */}
              <div
                className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/20 rounded-2xl backdrop-blur-xl border border-white/10 animate-bounce-slow flex items-center justify-center text-emerald-400 text-3xl will-change-transform"
                style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2 + scrollY * -0.25}px)` }}
              >
                <i className="fas fa-brain"></i>
              </div>
              <div
                className="absolute -bottom-10 -left-10 w-20 h-20 bg-blue-500/20 rounded-2xl backdrop-blur-xl border border-white/10 animate-pulse flex items-center justify-center text-blue-400 text-2xl will-change-transform"
                style={{ transform: `translate(${mousePos.x * -2.5}px, ${mousePos.y * -2.5 + scrollY * 0.15}px)` }}
              >
                <i className="fas fa-code"></i>
              </div>

              <div
                className="relative group overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl skew-y-1 hover:skew-y-0 transition-all duration-700 will-change-transform"
                style={{ transform: `skewY(${1 - scrollY * 0.005}deg)` }}
              >
                <img
                  src={'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop'}
                  alt="E-learning"
                  className="w-full h-auto transform scale-105 group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              </div>

              <div
                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-[2rem] shadow-2xl max-w-xs transition-transform duration-300 ease-out will-change-transform"
                style={{ transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8 + scrollY * -0.1}px)` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <i className="fas fa-rocket text-xl"></i>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Growth</p>
                    <p className="text-xl font-black text-slate-900">+124% Skills</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-slide-up">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Active Courses', val: '150+' },
            { label: 'Expert Mentors', val: '45+' },
            { label: 'Certificates Issued', val: '12K+' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <p className="text-4xl font-bold text-emerald-600 mb-1">{stat.val}</p>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-slide-up animation-delay-200">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Popular Learning Paths</h2>
            <p className="text-slate-500">Pick from our highest-rated professional certifications.</p>
          </div>
          <Link to="/catalog" className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all hover:translate-x-1">
            See All Courses <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map(course => (
            <Link key={course.id} to={`/course/${course.id}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm premium-card border border-slate-100">
              <div className="relative h-48 overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-bold text-emerald-700 shadow-sm">
                  {course.category}
                </div>
                {course.isFree && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500 rounded-lg text-xs font-bold text-white shadow-sm">
                    FREE
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{course.title}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><i className="far fa-clock"></i> {course.duration}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <p className="font-bold text-emerald-600">{course.isFree ? 'Enroll Free' : `₹${course.price}`}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">What Our Students Say</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl relative">
                <i className="fas fa-quote-left text-4xl text-emerald-500/20 absolute top-6 left-6"></i>
                <p className="text-emerald-50/80 mb-6 italic relative z-10">{t.text}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-emerald-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
