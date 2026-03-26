import React from 'react';

const Certificate = ({ course, userName, date }) => {
  // Generate a consistent but "random" verification ID
  const verificationId = `SED-${course.id.slice(0, 4)}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  return (
    <div className="relative w-full max-w-5xl mx-auto p-1 bg-[#fdfcf8] border-[16px] border-[#064e3b] shadow-2xl overflow-hidden font-serif animate-scale-in print:shadow-none print:border-[#064e3b]">
      {/* Decorative Gold Inner Border */}
      <div className="absolute inset-2 border-2 border-[#b45309]/30 pointer-events-none"></div>
      
      {/* Guilloché-inspired background pattern (Subtle Overlay) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #064e3b 1px, transparent 0)`, backgroundSize: '24px 24px' }}>
      </div>

      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
        <i className="fas fa-seedling text-[500px] text-[#064e3b]"></i>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 px-12 py-16 flex flex-col items-center text-center border-4 border-[#b45309]/10 m-4">
        
        {/* Header Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#065f46] to-[#047857] rounded-2xl flex items-center justify-center text-white shadow-lg transform -rotate-3 mb-4">
            <i className="fas fa-seedling text-4xl"></i>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-[#064e3b] uppercase tracking-[0.3em] font-sans">Seedit Academy</h3>
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#b45309] to-transparent opacity-50"></div>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.5em] font-sans font-bold">Excellence in Digital Learning</p>
          </div>
        </div>

        {/* Certificate Title */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 uppercase tracking-tighter mb-4 font-['Playfair_Display',serif]">
            Certificate <span className="text-[#064e3b]">of</span> Completion
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-[#b45309]"></div>
            <span className="text-lg text-[#b45309] font-medium italic font-['Playfair_Display',serif]">Highest Academic Honors</span>
            <div className="h-px w-20 bg-[#b45309]"></div>
          </div>
        </div>

        {/* Recipient Details */}
        <p className="text-xl text-slate-600 mb-8 font-medium">This prestigious award is officially conferred upon</p>
        
        <div className="relative mb-10 w-full flex flex-col items-center">
          <h2 className="text-6xl md:text-7xl font-bold text-[#064e3b] mb-4 font-sans px-12 tracking-tight">
            {userName}
          </h2>
          <div className="w-3/4 h-1 bg-gradient-to-r from-transparent via-[#064e3b]/20 to-transparent"></div>
        </div>

        {/* Course Details */}
        <p className="max-w-3xl text-xl text-slate-700 leading-relaxed mb-12 px-6">
          for demonstrating exceptional technical mastery and completing all professional requirements in the specialized curriculum of
          <span className="block mt-4 text-3xl font-black text-slate-900 border-y-2 border-slate-100 py-4 px-8 bg-slate-50/50 rounded-xl">
            {course.title}
          </span>
        </p>

        {/* Footer Section: Signatures and Stamp */}
        <div className="w-full grid grid-cols-3 items-end mt-12 px-8">
          
          {/* Signature 1 */}
          <div className="flex flex-col items-center scale-90 md:scale-100">
            <div className="mb-2 h-16 flex items-center justify-center">
              <span className="font-['Dancing_Script',cursive] text-4xl text-slate-800 -rotate-2">Dr. Suren</span>
            </div>
            <div className="w-48 h-px bg-slate-400 mb-2"></div>
            <p className="text-sm font-sans font-bold text-slate-600 uppercase tracking-widest">Director of Education</p>
            <p className="text-[10px] text-slate-400 font-sans uppercase">Seedit Academic Board</p>
          </div>

          {/* Golden Seal */}
          <div className="flex justify-center relative -bottom-4">
            <div className="w-40 h-40 relative group">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-[#b45309]/20 blur-xl rounded-full group-hover:bg-[#f59e0b]/30 transition-all"></div>
              
              {/* Seal Body */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b] via-[#b45309] to-[#78350f] rounded-full border-4 border-[#fef3c7] shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <div className="w-32 h-32 border-2 border-dashed border-white/30 rounded-full flex flex-col items-center justify-center text-white">
                  <i className="fas fa-award text-4xl mb-1 shadow-sm"></i>
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/90">Official Seal</span>
                  <div className="w-16 h-px bg-white/20 my-1"></div>
                  <span className="text-[10px] font-bold text-white tracking-tighter">EST. 2024</span>
                </div>
              </div>
              
              {/* Ribbons */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none opacity-80">
                <div className="w-6 h-16 bg-[#b45309] rounded-b-lg shadow-lg origin-top rotate-12"></div>
                <div className="w-6 h-16 bg-[#b45309] rounded-b-lg shadow-lg origin-top -rotate-12"></div>
              </div>
            </div>
          </div>

          {/* Date and Validation */}
          <div className="flex flex-col items-center scale-90 md:scale-100">
            <div className="mb-2 h-16 flex flex-col items-center justify-center">
              <p className="text-xl font-bold text-slate-800">{date}</p>
              <p className="text-[10px] font-sans font-bold text-emerald-600 uppercase tracking-widest">Date Issued</p>
            </div>
            <div className="w-48 h-px bg-slate-400 mb-2"></div>
            <p className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-tighter">Verification ID:</p>
            <p className="text-xs font-mono font-black text-[#b45309] uppercase tracking-widest">{verificationId}</p>
          </div>

        </div>
      </div>
      
      {/* Corner Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#b45309]/10 to-transparent flex items-center justify-center pointer-events-none">
        <i className="fas fa-certificate text-4xl text-[#b45309]/20 rotate-12"></i>
      </div>
    </div>
  );
};

export default Certificate;
