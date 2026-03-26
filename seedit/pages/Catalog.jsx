import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../services/courseService';

const Catalog = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [certificationFilter, setCertificationFilter] = useState('All');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === 'All' || c.category === activeCategory;
      const matchPrice = priceFilter === 'All' || (priceFilter === 'Paid' ? !c.isFree : c.isFree);
      const matchCert = certificationFilter === 'All' || c.certificateType === certificationFilter;
      return matchSearch && matchCategory && matchPrice && matchCert;
    });
  }, [courses, search, activeCategory, priceFilter, certificationFilter]);

  const categories = [
    'All',
    'Beginner & Foundational (No/Low Coding)',
    'Technical & Intermediate (Coding/ML Focused)',
    'Data Analytics',
    'UI/UX',
    'Digital Marketing',
    'Cloud Computing',
    'MERN Stack',
    'MEAN Stack',
    'Full Stack',
    'Front End',
    'Back End',
    'Prompt Engineering',
    'Cyber Security',
    'Networking & IT Support',
    'Network Administration'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="grid lg:grid-cols-[280px_1fr] gap-12">
        {/* Sidebar Filters */}
        <aside
          className="space-y-10 animate-slide-in-left will-change-transform"
          style={{ transform: `translateY(${Math.min(scrollY * 0.05, 50)}px)` }}
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Search Courses</h3>
            <div className="relative group">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"></i>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Categories</h3>
            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 scroll-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all hover:translate-x-1 ${activeCategory === cat ? 'bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/20' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Pricing</h3>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
              {['All', 'Paid', 'Free'].map(p => (
                <button
                  key={p}
                  onClick={() => setPriceFilter(p)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${priceFilter === p ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Certification</h3>
            <div className="space-y-2">
              {['All', 'Professional', 'Foundational', 'Expert'].map(cert => (
                <label key={cert} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="cert"
                    className="accent-emerald-600"
                    checked={certificationFilter === cert}
                    onChange={() => setCertificationFilter(cert)}
                  />
                  <span className={`text-sm transition-colors ${certificationFilter === cert ? 'text-emerald-700 font-bold' : 'text-slate-600 group-hover:text-emerald-600'}`}>{cert}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Course Grid */}
        <main className="space-y-8 animate-slide-up animation-delay-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Showing {filteredCourses.length} Courses
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">
              Sort by: <span className="font-bold text-slate-900">Trending</span> <i className="fas fa-chevron-down text-[10px]"></i>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 animate-scale-in">
              <i className="fas fa-search text-4xl text-slate-200 mb-4"></i>
              <p className="text-slate-500">No courses match your filters.</p>
              <button onClick={() => { setSearch(''); setActiveCategory('All'); setPriceFilter('All'); setCertificationFilter('All'); }} className="mt-4 text-emerald-600 font-bold hover:underline">Clear all filters</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link key={course.id} to={`/course/${course.id}`} className="flex flex-col bg-white rounded-3xl border border-slate-100 premium-card h-full">
                  <div className="relative h-44 overflow-hidden rounded-t-3xl">
                    <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded text-[10px] font-black uppercase text-emerald-800">
                      {course.category}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-2 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">{course.title}</h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-4">
                      <span><i className="far fa-user mr-1"></i> {course.students.toLocaleString()}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                      <p className="text-lg font-bold text-emerald-700 capitalize">{course.isFree ? 'FREE' : `₹${course.price}`}</p>
                      <button className="text-xs font-bold px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all hover:scale-105 active:scale-95">
                        Preview
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Catalog;
