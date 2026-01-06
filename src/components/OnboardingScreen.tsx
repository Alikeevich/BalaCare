import React, { useState } from 'react';
import { Heart, Users, Sparkles, ArrowRight } from 'lucide-react';

interface OnboardingScreenProps {
  onClose: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      icon: <Heart className="w-24 h-24 text-white drop-shadow-lg" />,
      title: "Добро пожаловать в BalaCare",
      description: "Ваша персональная поддержка и опора в мире особых потребностей.",
      bg: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
    },
    {
      icon: <Users className="w-24 h-24 text-white drop-shadow-lg" />,
      title: "Вы не одни",
      description: "Огромное сообщество родителей и специалистов готово помочь вам в любую минуту.",
      bg: "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400"
    },
    {
      icon: <Sparkles className="w-24 h-24 text-white drop-shadow-lg" />,
      title: "Всё в одном месте",
      description: "Обучение, врачи, товары и общение — мы собрали всё необходимое здесь.",
      bg: "bg-gradient-to-br from-orange-400 via-red-400 to-pink-500"
    }
  ];

  return (
    <div className={`fixed inset-0 z-[100] transition-colors duration-700 ${slides[currentSlide].bg} flex flex-col items-center justify-between p-6 overflow-hidden`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-bounce delay-1000"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-md w-full text-center mt-10">
        <div className="mb-10 transform transition-all duration-500 hover:scale-110 animate-float">
          {slides[currentSlide].icon}
        </div>
        <h1 className="text-4xl font-black text-white mb-6 leading-tight drop-shadow-md">
          {slides[currentSlide].title}
        </h1>
        <p className="text-xl text-white/90 font-medium leading-relaxed max-w-xs mx-auto">
          {slides[currentSlide].description}
        </p>

        <div className="flex gap-3 mt-12">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                idx === currentSlide ? 'w-10 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'w-2.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-4 pb-10">
        {currentSlide === slides.length - 1 ? (
          <button
            onClick={onClose}
            className="w-full py-4 bg-white text-pink-600 rounded-3xl font-black text-xl shadow-2xl hover:shadow-white/25 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
          >
            Начать путешествие
            <ArrowRight className="w-6 h-6" strokeWidth={3} />
          </button>
        ) : (
          <button
            onClick={() => setCurrentSlide(currentSlide + 1)}
            className="w-full py-4 bg-white/20 backdrop-blur-md text-white rounded-3xl font-bold text-lg border border-white/40 hover:bg-white/30 active:scale-95 transition-all duration-300"
          >
            Далее
          </button>
        )}
        
        {currentSlide < slides.length - 1 && (
          <button
            onClick={onClose}
            className="w-full py-2 text-white/70 font-semibold text-sm hover:text-white transition-colors"
          >
            Пропустить вступление
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;