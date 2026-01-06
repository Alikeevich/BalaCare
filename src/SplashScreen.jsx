// src/components/SplashScreen.jsx
import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';

const SplashScreen = ({ onEnter }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-white text-center">
      <SparklesIcon className="w-16 h-16 text-indigo-600 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Добро пожаловать в BalaCare!
      </h1>
      <p className="text-gray-600 mb-8 max-w-sm">
        BalaCare — ваш надежный помощник и сообщество для родителей, воспитывающих детей с особыми потребностями.
      </p>

      {/* Блок о проблеме */}
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-8 max-w-md w-full shadow-lg">
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">
          Мы понимаем...
        </h2>
        <p className="text-indigo-600">
          Путь родителя требует сил и информации. Не оставайтесь с этим наедине!
        </p>
      </div>

      <p className="text-xl font-medium text-gray-800 mb-10">
        <span className="text-indigo-600 font-bold">С BalaCare</span> вы никогда не останетесь одни!
      </p>

      <button
        onClick={onEnter}
        className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
      >
        Начать пользоваться сайтом
      </button>
    </div>
  );
};

export default SplashScreen;