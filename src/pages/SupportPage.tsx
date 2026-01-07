import React, { useEffect, useState } from 'react';
import { Star, Filter, Loader2, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import AuthGate from '../components/AuthGate';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';

type SpecialistWithProfile = Database['public']['Tables']['specialists']['Row'] & {
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    city: string | null;
  } | null;
  specialist_categories: {
    name: string;
  } | null;
};

type Category = Database['public']['Tables']['specialist_categories']['Row'];

const SupportPage: React.FC = () => {
  // Берем функции из контекста
  const { session, openAuthModal } = useAuth();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [specialists, setSpecialists] = useState<SpecialistWithProfile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [selectedSpecialist, setSelectedSpecialist] = useState<SpecialistWithProfile | null>(null);

  const isLoggedIn = !!session;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
        fetchSpecialists(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      const { data: catData } = await supabase.from('specialist_categories').select('*');
      if (catData) setCategories(catData);
      
      await fetchSpecialists(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialists = async (categoryId: string | null) => {
    setLoading(true);
    let query = supabase
      .from('specialists')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url, city),
        specialist_categories:category_id (name)
      `)
      .eq('is_active', true);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (!error && data) {
      // @ts-ignore: join types issue
      setSpecialists(data);
    }
    setLoading(false);
  };

  return (
    <div className="pt-6 pb-24 bg-gray-50 min-h-screen">
      <div className="px-6 mb-6">
        <h1 className="text-3xl font-black text-gray-900">BalaSupport</h1>
        <p className="text-gray-500 font-medium mt-1">
          Найдите лучшего специалиста для вашего ребенка
        </p>
      </div>

      {/* Categories Scroll */}
      <div className="flex gap-3 px-6 overflow-x-auto pb-4 no-scrollbar mb-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`whitespace-nowrap px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${
            selectedCategory === null 
              ? 'bg-gray-900 text-white shadow-lg scale-105' 
              : 'bg-white text-gray-600 border border-gray-100'
          }`}
        >
          <Filter className="w-4 h-4" />
          Все
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${
              selectedCategory === cat.id 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-200 scale-105 shadow-lg' 
                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Specialists Grid */}
      <div className="px-6 space-y-5">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
          </div>
        ) : specialists.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 mb-2">В этой категории пока нет специалистов</p>
            <button onClick={() => setSelectedCategory(null)} className="text-purple-600 font-bold text-sm">
                Показать всех
            </button>
          </div>
        ) : (
          specialists.map((spec) => (
            <div key={spec.id} className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-shadow">
              
              <div className="flex gap-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shadow-inner">
                    {spec.profiles?.avatar_url ? (
                       <img src={spec.profiles.avatar_url} alt={spec.profiles.full_name || ''} className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white px-1.5 py-0.5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-0.5 text-xs font-bold text-gray-800">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {spec.rating || 5.0}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 truncate">
                    {spec.profiles?.full_name || 'Специалист'}
                  </h3>
                  <p className="text-purple-600 text-sm font-semibold mb-1 truncate">
                    {spec.specialist_categories?.name}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 gap-1">
                    <MapPin className="w-3 h-3" />
                    {spec.profiles?.city || 'Онлайн'}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-4 bg-gray-50 p-3 rounded-xl min-h-[60px]">
                {spec.about || 'Описание отсутствует'}
              </p>

              <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Цена за сеанс</span>
                  <span className="font-black text-gray-900 text-lg">
                    {spec.price_per_session ? `${spec.price_per_session.toLocaleString()} ₸` : 'Бесплатно'}
                  </span>
                </div>
                
                <button 
                  onClick={() => isLoggedIn ? setSelectedSpecialist(spec) : openAuthModal()}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transform transition-all active:scale-95 ${
                    isLoggedIn 
                      ? 'bg-gray-900 text-white hover:bg-gray-800' 
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {isLoggedIn ? 'Записаться' : 'Войти'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {!isLoggedIn && (
        <div className="mt-8 px-4 pb-4">
          <AuthGate />
        </div>
      )}

      {selectedSpecialist && session && (
        <BookingModal 
          specialist={selectedSpecialist} 
          userId={session.user.id}
          onClose={() => setSelectedSpecialist(null)}
          onSuccess={() => {
            alert("Запись успешно создана! Администратор свяжется с вами.");
          }}
        />
      )}
    </div>
  );
};

export default SupportPage;