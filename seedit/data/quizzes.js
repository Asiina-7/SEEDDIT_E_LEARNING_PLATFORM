export const QUIZZES = {
    'ai-everyone': {
        id: 'q-ai-everyone',
        courseId: 'ai-everyone',
        passingScore: 3,
        questions: [
            {
                id: 'q1',
                question: 'What is Artificial Intelligence?',
                options: ['A type of plant', 'Simulating human intelligence in machines', 'A new video game', 'A cooking technique'],
                correctAnswer: 1
            },
            {
                id: 'q2',
                question: 'Which of these is NOT a subset of AI?',
                options: ['Machine Learning', 'Deep Learning', 'Quantum Gardening', 'Natural Language Processing'],
                correctAnswer: 2
            },
            {
                id: 'q3',
                question: 'What is a "Prompt" in AI?',
                options: ['A reminder to go to bed', 'The input given to an AI model', 'A type of computer screen', 'A fast runner'],
                correctAnswer: 1
            },
            {
                id: 'q4',
                question: 'Who is the instructor of "AI for Everyone"?',
                options: ['Andrew Ng', 'Elon Musk', 'Sam Altman', 'Bill Gates'],
                correctAnswer: 0
            }
        ]
    },
    'default': {
        id: 'q-default',
        courseId: 'default',
        passingScore: 3,
        questions: [
            {
                id: 'd1',
                question: 'What was the primary focus of this course?',
                options: ['Mastering the core concepts', 'Learning to bake', 'Exploring underwater', 'Building a rocket'],
                correctAnswer: 0
            },
            {
                id: 'd2',
                question: 'Which tool was most frequently discussed?',
                options: ['Standard industry tools', 'A hammer', 'A paintbrush', 'A spatula'],
                correctAnswer: 0
            },
            {
                id: 'd3',
                question: 'What is the goal of the final project?',
                options: ['To prove technical proficiency', 'To win a race', 'To draw a picture', 'To sing a song'],
                correctAnswer: 0
            },
            {
                id: 'd4',
                question: 'How many lessons were in this module?',
                options: ['4 Lessons', '10 Lessons', '1 Lesson', 'None'],
                correctAnswer: 0
            }
        ]
    }
};

export const getQuizForCourse = (courseId) => {
    return QUIZZES[courseId] || QUIZZES['default'];
};
