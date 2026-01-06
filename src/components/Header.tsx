import React from 'react';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogin, onLogout }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl px-6 py-3 flex justify-between items-center border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-md">
          B
        </div>
        <span className="text-xl font-extrabold tracking-tight text-gray-900">
          Bala<span className="text-purple-600">Care</span>
        </span>
      </div>
      
      {isLoggedIn ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-700 hidden sm:block">Мама Артема</span>
          <button 
            onClick={onLogout}
            className="w-9 h-9 bg-gray-100 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center"
            title="Выйти"
          >
             {/* Заглушка аватара */}
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
          </button>
        </div>
      ) : (
        <button 
          onClick={onLogin}
          className="px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg active:scale-95"
        >
          Войти
        </button>
      )}
    </header>
  );
};

export default Header;