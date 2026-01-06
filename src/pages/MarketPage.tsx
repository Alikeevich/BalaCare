import React from 'react';
import { Gift, Heart, ShoppingBag } from 'lucide-react';

interface MarketPageProps {
  isLoggedIn: boolean;
  onLogin: () => void;
}

const MarketPage: React.FC<MarketPageProps> = ({ isLoggedIn, onLogin }) => {
  const categories = [
    { name: "Питание", icon: "🍏", color: "bg-green-100 text-green-600" },
    { name: "Лекарства", icon: "💊", color: "bg-blue-100 text-blue-600" },
    { name: "Игрушки", icon: "🧸", color: "bg-pink-100 text-pink-600" },
    { name: "Уход", icon: "🧴", color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="pt-6 pb-20 bg-gray-50 min-h-screen">
      <div className="px-6 mb-6">
        <h1 className="text-3xl font-black text-gray-900">BalaMarket</h1>
        <p className="text-gray-500 font-medium">Каталог товаров и благотворительность</p>
      </div>

      <div className="mx-6 p-6 rounded-3xl bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-xl shadow-orange-200 mb-8 relative overflow-hidden group">
         <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
         <Gift className="w-10 h-10 mb-3 relative z-10" />
         <h3 className="text-xl font-bold mb-1 relative z-10">Отдам даром</h3>
         <p className="text-orange-100 text-sm mb-4 relative z-10 max-w-[80%]">Обменивайтесь вещами и помогайте другим семьям</p>
         <button 
            onClick={isLoggedIn ? () => {} : onLogin}
            className="bg-white text-orange-600 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-lg active:scale-95 transition-all relative z-10"
         >
           {isLoggedIn ? 'Перейти' : 'Войти для доступа'}
         </button>
      </div>

      <h3 className="px-6 font-bold text-lg text-gray-800 mb-4">Категории</h3>
      <div className="grid grid-cols-2 gap-4 px-6 mb-8">
        {categories.map((cat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3 border border-gray-100 hover:border-gray-300 transition-colors cursor-pointer">
             <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${cat.color}`}>
               {cat.icon}
             </div>
             <span className="font-bold text-gray-700">{cat.name}</span>
          </div>
        ))}
      </div>

      <div className="px-6">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Популярное</h3>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((_, i) => (
             <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
               <div className="h-32 bg-gray-100 rounded-xl mb-3 relative">
                 <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500">
                    <Heart className="w-4 h-4" />
                 </button>
               </div>
               <h4 className="font-bold text-gray-800 text-sm mb-1">Развивающий куб</h4>
               <p className="text-xs text-red-500 font-semibold bg-red-50 inline-block px-2 py-0.5 rounded-md mb-2">Противопоказаний нет</p>
               <div className="flex justify-between items-center">
                 <span className="font-bold text-base">5 400 ₸</span>
                 <button 
                  onClick={isLoggedIn ? () => {} : onLogin}
                  className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center active:scale-90 transition-transform"
                 >
                   <ShoppingBag className="w-4 h-4" />
                 </button>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketPage;