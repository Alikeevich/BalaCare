import React from 'react';
import { Lock } from 'lucide-react';

interface AuthGateProps {
  onLogin: () => void;
}

const AuthGate: React.FC<AuthGateProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mt-4 mx-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 relative">
        <Lock className="w-10 h-10 text-gray-400" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white"></div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Доступ ограничен</h3>
      <p className="text-gray-500 mb-6 text-sm">
        Чтобы пользоваться этой функцией, совершать покупки или писать в чат, пожалуйста, авторизуйтесь.
      </p>
      <button 
        onClick={onLogin}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all"
      >
        Войти / Регистрация
      </button>
    </div>
  );
};

export default AuthGate;