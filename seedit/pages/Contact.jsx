import React, { useState } from 'react';
import API from '../services/api';

const Contact = () => {
  const [formState, setFormState] = useState('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const socialLinks = [
    { platform: 'facebook', url: 'https://facebook.com/seedit' },
    { platform: 'twitter', url: 'https://twitter.com/seedit' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/in/asina-perumal-19a66931b/' },
    { platform: 'instagram', url: 'https://instagram.com/seedit' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState('sending');

    try {
      const response = await API.post('/contact', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      if (response.data.success) {
        setFormState('sent');
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      } else {
        setFormState('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFormState('error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Contact Info */}
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">How can we help?</h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              Have questions about a course, certification, or team licensing? Our expert support team is here to help you grow your career.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: 'fa-envelope', label: 'Email Us', value: 'learn@seedit.io', color: 'bg-emerald-50 text-emerald-600' },
              { icon: 'fa-phone', label: 'Call Us', value: '+91 7825047843', color: 'bg-blue-50 text-blue-600' },
              { icon: 'fa-map-marker-alt', label: 'Headquarters', value: 'R S Puram,Coimbatore', color: 'bg-amber-50 text-amber-600' },
              { icon: 'fa-comments', label: 'Live Chat', value: '24/7 Support', color: 'bg-purple-50 text-purple-600' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
                <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <i className={`fas ${item.icon} text-xl`}></i>
                </div>
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">{item.label}</h3>
                <p className="font-bold text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-6">Follow our growth</h3>
            <div className="flex gap-4">
              {socialLinks.map(({ platform, url }) => (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                  <i className={`fab fa-${platform}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16"></div>
          
          {formState === 'sent' ? (
            <div className="py-12 text-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-check text-3xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Message Received!</h2>
              <p className="text-slate-500 mb-8">We'll get back to you within 24 hours.</p>
              <button 
                onClick={() => setFormState('idle')}
                className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {formState === 'error' && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                  <i className="fas fa-exclamation-circle text-lg"></i>
                  Something went wrong. Please try again or email us directly.
                </div>
              )}
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Subject</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all appearance-none"
                >
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Billing Question</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Message</label>
                <textarea 
                  required 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all resize-none" 
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={formState === 'sending'}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
              >
                {formState === 'sending' ? (
                  <i className="fas fa-circle-notch fa-spin"></i>
                ) : (
                  <>
                    <span>Send Message</span>
                    <i className="fas fa-paper-plane text-xs opacity-50"></i>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
