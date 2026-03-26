const categories = [
  'Beginner & Foundational (No/Low Coding)',
  'Technical & Intermediate (Coding/ML Focused)',
  'Data Analytics', 'UI/UX', 'Digital Marketing',
  'Cloud Computing', 'MERN Stack', 'MEAN Stack', 'Full Stack',
  'Front End', 'Back End', 'Prompt Engineering', 'Cyber Security',
  'Networking & IT Support', 'Network Administration'
];

const generateVideos = (courseTitle) => [
  { id: 'v1', title: `Introduction to ${courseTitle}`, duration: '10:05', url: 'https://www.w3schools.com/html/mov_bbb.mp4', isCompleted: false },
  { id: 'v2', title: 'Core Fundamentals', duration: '15:20', url: 'https://www.w3schools.com/html/movie.mp4', isCompleted: false },
  { id: 'v3', title: 'Advanced Concepts', duration: '22:45', url: 'https://www.w3schools.com/html/mov_bbb.mp4', isCompleted: false },
  { id: 'v4', title: 'Final Capstone Project', duration: '05:30', url: 'https://www.w3schools.com/html/movie.mp4', isCompleted: false },
];

const AI_COURSES = [
  // Beginner & Foundational
  {
    id: 'ai-everyone',
    title: 'AI for Everyone (DeepLearning.AI) (Coursera)',
    category: 'Beginner & Foundational (No/Low Coding)',
    description: 'Focuses on AI terminology and business applications. Perfect for non-technical roles.',
    instructor: 'Andrew Ng',
    price: 49.99,
    isFree: false,
    rating: 4.8,
    students: 850000,
    duration: '6h 0m',
    thumbnail: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=600&q=80',
    videos: generateVideos('AI for Everyone'),
    certificateType: 'Foundational',
    resources: [
      { id: 're-1', title: 'AI Glossary.pdf', type: 'pdf', url: '#' },
      { id: 're-2', title: 'Business Case Study.zip', type: 'zip', url: '#' },
      { id: 're-3', title: 'DeepLearning.AI Community', type: 'link', url: 'https://community.deeplearning.ai' }
    ]
  },
  {
    id: 'google-ai-essentials',
    title: 'Google AI Essentials (Google)',
    category: 'Beginner & Foundational (No/Low Coding)',
    description: 'Covers practical AI tools and prompt engineering for everyday productivity.',
    instructor: 'Google Experts',
    price: 0,
    isFree: true,
    rating: 4.7,
    students: 120000,
    duration: '10h 0m',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
    videos: generateVideos('Google AI Essentials'),
    certificateType: 'Foundational',
    resources: [
      { id: 'ge-1', title: 'Google AI Toolkit.pdf', type: 'pdf', url: '#' },
      { id: 'ge-2', title: 'Prompt Templates.zip', type: 'zip', url: '#' }
    ]
  },
  {
    id: 'understanding-ai-datacamp',
    title: 'Understanding Artificial Intelligence (DataCamp)',
    category: 'Beginner & Foundational (No/Low Coding)',
    description: "Provides a holistic view of AI's societal impact and core mechanics.",
    instructor: 'DataCamp Team',
    price: 29.99,
    isFree: false,
    rating: 4.6,
    students: 45000,
    duration: '4h 0m',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80',
    videos: generateVideos('Understanding AI'),
    certificateType: 'Foundational'
  },
  // Technical & Intermediate
  {
    id: 'ml-specialization',
    title: 'Machine Learning Specialization (DeepLearning.AI/Stanford)',
    category: 'Technical & Intermediate (Coding/ML Focused)',
    description: 'The standard, comprehensive machine learning course by Andrew Ng. Covers supervised and unsupervised learning.',
    instructor: 'Andrew Ng',
    price: 79.99,
    isFree: false,
    rating: 4.9,
    students: 1500000,
    duration: '40h 0m',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=600&q=80',
    videos: generateVideos('ML Specialization'),
    certificateType: 'Expert',
    resources: [
      { id: 'ml-1', title: 'Math for ML.pdf', type: 'pdf', url: '#' },
      { id: 'ml-2', title: 'Lab Notebooks.zip', type: 'zip', url: '#' }
    ]
  },
  {
    id: 'google-ml-crash-course',
    title: 'Machine Learning Crash Course (Google)',
    category: 'Technical & Intermediate (Coding/ML Focused)',
    description: 'Fast-paced, project-based training with Python and TensorFlow.',
    instructor: 'Google Developers',
    price: 0,
    isFree: true,
    rating: 4.8,
    students: 500000,
    duration: '15h 0m',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80',
    videos: generateVideos('ML Crash Course'),
    certificateType: 'Professional'
  },
  {
    id: 'ibm-ai-engineering',
    title: 'IBM AI Engineering Professional Certificate',
    category: 'Technical & Intermediate (Coding/ML Focused)',
    description: 'Covers deep learning, machine learning, and NLP using PyTorch and Keras.',
    instructor: 'IBM Data Science Team',
    price: 69.99,
    isFree: false,
    rating: 4.7,
    students: 80000,
    duration: '120h 0m',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4628c9757?auto=format&fit=crop&w=600&q=80',
    videos: generateVideos('AI Engineering'),
    certificateType: 'Expert'
  }
];

export const COURSES = categories.flatMap((cat, catIdx) => {
  if (cat === 'Beginner & Foundational (No/Low Coding)') return AI_COURSES.filter(c => c.category === cat);
  if (cat === 'Technical & Intermediate (Coding/ML Focused)') return AI_COURSES.filter(c => c.category === cat);

  return Array.from({ length: 3 }).map((_, i) => ({
    id: `${cat.toLowerCase().replace(/ /g, '-')}-${i}`,
    title: `${cat} ${i + 1}: Masterclass ${2024 + i}`,
    category: cat,
    description: `A comprehensive guide to mastering ${cat}. Learn industry-standard tools and techniques used by professionals globally.`,
    instructor: ['Sarah Jenkins', 'Dr. Aris Thorne', 'Michael Chen', 'Elena Rodriguez'][i % 4],
    price: i % 2 === 0 ? 49.99 : 0,
    isFree: i % 2 !== 0,
    rating: 4.5 + (Math.random() * 0.5),
    students: Math.floor(Math.random() * 5000) + 1200,
    duration: `${Math.floor(Math.random() * 20) + 5}h ${Math.floor(Math.random() * 60)}m`,
    thumbnail: `https://images.unsplash.com/photo-${[
      '1516321318423-f06f85e504b3', // education/tech
      '1522202176988-66273c2fd55f', // study/group
      '1513258496099-48168024aec0', // learning/notes
      '1517245386807-bb43f82c33c4', // development
      '1434031211128-0c29bd39931b', // student/laptop
      '1501504905991-762aa3b3f538', // book/library
      '1497215728101-856f4ea42174', // office/modern
      '1486312338219-ce68d2c6f44d', // laptop/typing
      '1519389950473-47ba0277781c'  // team/work
    ][(catIdx + i) % 9]}?auto=format&fit=crop&w=600&q=80`,
    videos: generateVideos(cat),
    certificateType: i % 3 === 0 ? 'Expert' : 'Professional',
    resources: [
      { id: 'res-1', title: `${cat} Syllabus.pdf`, type: 'pdf', url: '#' },
      { id: 'res-2', title: 'Practice Exercises.zip', type: 'zip', url: '#' },
      { id: 'res-3', title: 'Community Discord', type: 'link', url: 'https://discord.com' }
    ]
  }));
});

export const TESTIMONIALS = [
  { name: 'Raj Thiyagu', role: 'Full Stack Dev', text: 'Seedit transformed my career path. The MERN stack course was incredibly detailed.' },
  { name: 'Surentharan', role: 'UI Designer', text: 'The UI/UX course certification helped me land my first agency job. High-quality content!' },
  { name: 'Monisha', role: 'Security Analyst', text: 'Prompt Engineering sounds hype, but Seedit actually taught me real productivity hacks.' }
];
