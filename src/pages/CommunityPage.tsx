import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import AuthGate from '../components/AuthGate';

interface CommunityPageProps {
  isLoggedIn: boolean;
  onLogin: () => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ isLoggedIn, onLogin }) => {
  return (
    <div className="pt-6 pb-20 bg-gray-50 min-h-screen">
      <div className="px-6 mb-6">
        <h1 className="text-3xl font-black text-gray-900">Сообщество</h1>
        <p className="text-gray-500 font-medium">Делитесь опытом и находите друзей</p>
      </div>

      {!isLoggedIn ? (
         <AuthGate onLogin={onLogin} />
      ) : (
        <div className="px-6 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm flex gap-3 items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="flex-1 text-gray-400 text-sm font-medium">О чем хотите рассказать?</div>
            <button className="text-purple-600 font-bold text-sm">Пост</button>
          </div>

          {[1, 2, 3].map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-start mb-3">
                 <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300"></div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">Елена С.</h4>
                      <p className="text-xs text-gray-400">Мама Артема (5 лет)</p>
                    </div>
                 </div>
                 <span className="text-xs text-gray-300">2ч</span>
               </div>
               <p className="text-gray-700 text-sm leading-relaxed mb-4">
                 Девочки, подскажите хорошего логопеда в районе Алматы? Мы перепробовали уже троих, но результата пока нет...
               </p>
               <div className="flex gap-6 border-t border-gray-50 pt-3">
                 <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors">
                   <Heart className="w-5 h-5" /> <span className="text-xs font-bold">12</span>
                 </button>
                 <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                   <MessageCircle className="w-5 h-5" /> <span className="text-xs font-bold">5</span>
                 </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;