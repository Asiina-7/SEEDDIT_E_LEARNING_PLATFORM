import React, { useState } from 'react';

const Quiz = ({ quiz, onComplete, onCancel }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    const handleNext = () => {
        if (selectedOption === null) return;

        if (selectedOption === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }

        if (isLastQuestion) {
            setShowResults(true);
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setShowResults(false);
    };

    if (showResults) {
        const passed = score >= quiz.passingScore;
        return (
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full mx-auto shadow-2xl animate-in zoom-in duration-300">
                <div className="text-center space-y-6">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${passed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                        <i className={`fas ${passed ? 'fa-award' : 'fa-redo'} text-4xl`}></i>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold mb-2">{passed ? 'Congratulations!' : 'Keep Learning!'}</h2>
                        <p className="text-slate-400">
                            You scored <span className={`font-bold ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>{score} out of {quiz.questions.length}</span>.
                            {passed ? ' You have passed the final assessment.' : ' You need at least ' + quiz.passingScore + ' correct answers to pass.'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        {!passed && (
                            <button
                                onClick={handleRestart}
                                className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
                            >
                                Try Again
                            </button>
                        )}
                        {passed ? (
                            <button
                                onClick={() => onComplete(score)}
                                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all"
                            >
                                Claim Certificate
                            </button>
                        ) : (
                            <button
                                onClick={onCancel}
                                className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all text-slate-400"
                            >
                                Back to Lessons
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full mx-auto shadow-2xl min-h-[500px] flex flex-col animate-in slide-in-from-bottom duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Final Assessment</span>
                    <h2 className="text-2xl font-bold mt-1">Course Quiz</h2>
                </div>
                <div className="text-right">
                    <span className="text-slate-500 text-xs font-bold block mb-1">Question</span>
                    <span className="text-xl font-bold">{currentQuestionIndex + 1}<span className="text-slate-600 text-sm">/{quiz.questions.length}</span></span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/5 rounded-full mb-10 overflow-hidden">
                <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                ></div>
            </div>

            {/* Question */}
            <div className="flex-1">
                <h3 className="text-xl font-medium mb-8 leading-relaxed">
                    {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedOption(idx)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${selectedOption === idx
                                    ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400'
                                    : 'bg-white/5 border-white/5 hover:border-white/20 text-slate-300'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedOption === idx ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-700'
                                }`}>
                                {selectedOption === idx && <i className="fas fa-check text-[10px]"></i>}
                            </div>
                            <span className="font-medium text-sm">{option}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-10 flex items-center justify-between pt-6 border-t border-white/5">
                <button
                    onClick={onCancel}
                    className="text-slate-500 hover:text-white transition-colors text-sm font-bold"
                >
                    Skip for now
                </button>
                <button
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    className={`px-10 py-3 rounded-xl font-bold transition-all ${selectedOption === null
                            ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        }`}
                >
                    {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                </button>
            </div>
        </div>
    );
};

export default Quiz;
