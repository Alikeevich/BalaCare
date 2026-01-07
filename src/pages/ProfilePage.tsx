import React, { useState, useEffect, useRef } from 'react';
import { User, MapPin, Save, Loader2, LogOut, Globe, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import AuthGate from '../components/AuthGate';

// Интерфейсы для API
interface ApiCountry {
  name: string;
  Iso2: string;
  Iso3: string;
}

const ProfilePage: React.FC = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('parent');
  
  // --- ЛОГИКА ЛОКАЦИИ (API) ---
  const [countries, setCountries] = useState<ApiCountry[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  
  const [selectedCountryName, setSelectedCountryName] = useState('Kazakhstan'); // Имя для API
  const [selectedCity, setSelectedCity] = useState('');
  
  // Состояния загрузки
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // 1. Загрузка данных профиля
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setRole(profile.role || 'parent');
      if (profile.city) {
          setSelectedCity(profile.city);
      }
      // Примечание: Мы не храним страну в profiles, поэтому по дефолту Казахстан.
      // В реальном проекте лучше добавить колонку country в таблицу profiles.
    }
  }, [profile]);

  // 2. Загрузка списка СТРАН при открытии страницы
  useEffect(() => {
    const fetchCountries = async () => {
        setLoadingCountries(true);
        try {
            const response = await fetch('https://countriesnow.space/api/v0.1/countries/iso');
            const data = await response.json();
            if (!data.error) {
                setCountries(data.data);
            }
        } catch (e) {
            console.error("Ошибка загрузки стран", e);
        } finally {
            setLoadingCountries(false);
        }
    };
    fetchCountries();
  }, []);

  // 3. Загрузка списка ГОРОДОВ при смене страны
  useEffect(() => {
    const fetchCities = async () => {
        if (!selectedCountryName) return;
        setLoadingCities(true);
        try {
            const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country: selectedCountryName })
            });
            const data = await response.json();
            if (!data.error) {
                setCities(data.data);
            } else {
                setCities([]); // Если городов нет
            }
        } catch (e) {
            console.error("Ошибка загрузки городов", e);
            setCities([]);
        } finally {
            setLoadingCities(false);
        }
    };

    fetchCities();
  }, [selectedCountryName]);


  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0 || !user) return;
      
      setUploadingAvatar(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      alert('Аватарка обновлена!');
      window.location.reload(); 

    } catch (error: any) {
      console.error(error);
      alert('Ошибка: ' + error.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          city: selectedCity, // Сохраняем выбранный город
          role: role as 'parent' | 'specialist'
        })
        .eq('id', user.id);

      if (error) throw error;
      alert('Профиль обновлен!');
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return (
      <div className="flex h-screen items-center justify-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
  );
  
  if (!user) return <div className="pt-20 px-6"><AuthGate /></div>;

  return (
    <div className="pt-6 pb-24 bg-gray-50 min-h-screen">
      <div className="px-6 mb-6">
        <h1 className="text-3xl font-black text-gray-900">Мой профиль</h1>
      </div>

      <div className="px-6 space-y-6">
        {/* Карточка с аватаром */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20"></div>
          
          <div className="relative z-10 mb-4 group">
            <div className="w-28 h-28 bg-white rounded-full overflow-hidden border-4 border-white shadow-lg relative">
               {uploadingAvatar ? (
                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
                   <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                 </div>
               ) : profile?.avatar_url ? (
                 <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
                     <User className="w-10 h-10 text-gray-400"/>
                 </div>
               )}
               
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
               >
                 <Camera className="w-8 h-8 text-white drop-shadow-md" />
               </div>
            </div>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors active:scale-90"
            >
              <Camera className="w-4 h-4" />
            </button>

            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900">{profile?.full_name || user.email}</h2>
          <p className="text-gray-400 text-sm mb-4">{user.email}</p>
          
          <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {profile?.role === 'specialist' ? 'Специалист' : 'Родитель'}
          </div>
        </div>

        {/* Форма редактирования */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-5">
          <h3 className="font-bold text-gray-800 text-lg">Настройки аккаунта</h3>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Ваше Имя</label>
            <input 
              type="text" 
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-gray-800 transition-all"
            />
          </div>

          {/* ВЫБОР СТРАНЫ (API) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Страна</label>
            <div className="relative">
              <Globe className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <select 
                value={selectedCountryName}
                onChange={(e) => {
                    setSelectedCountryName(e.target.value);
                    setSelectedCity(''); // Сброс города при смене страны
                }}
                disabled={loadingCountries}
                className="w-full pl-10 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-gray-800 appearance-none"
              >
                  {loadingCountries ? (
                      <option>Загрузка стран...</option>
                  ) : (
                      <>
                        {/* Выводим Казахстан первым для удобства */}
                        <option value="Kazakhstan">Kazakhstan</option>
                        {countries
                            .filter(c => c.name !== 'Kazakhstan')
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((country) => (
                                <option key={country.Iso2} value={country.name}>
                                    {country.name}
                                </option>
                        ))}
                      </>
                  )}
              </select>
            </div>
          </div>

          {/* ВЫБОР ГОРОДА (API) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Город</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              {loadingCities ? (
                  <div className="w-full pl-10 p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-400 text-sm flex items-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" /> Загрузка городов...
                  </div>
              ) : cities.length > 0 ? (
                  <select 
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    className="w-full pl-10 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-gray-800 appearance-none"
                  >
                    <option value="" disabled>Выберите город</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                  </select>
              ) : (
                  // Fallback (если города не загрузились или нет интернета)
                  <input 
                    type="text"
                    placeholder="Введите название города"
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    className="w-full pl-10 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-gray-800"
                  />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Роль на сайте</label>
            <div className="relative">
                <select 
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-gray-800 appearance-none transition-all"
                >
                <option value="parent">Родитель</option>
                <option value="specialist">Специалист</option>
                </select>
                <div className="absolute right-4 top-4 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3.5 mt-2 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all flex justify-center items-center gap-2 text-sm"
          >
            {saving ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4" /> Сохранить изменения</>}
          </button>
        </div>

        <button 
            onClick={signOut}
            className="w-full py-3.5 text-red-500 font-bold bg-red-50 rounded-xl hover:bg-red-100 active:scale-95 transition-all flex justify-center items-center gap-2"
        >
            <LogOut className="w-5 h-5" /> Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;