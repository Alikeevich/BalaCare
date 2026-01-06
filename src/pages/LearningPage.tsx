import React, { useEffect, useState } from 'react';
import { Video, Play, FileText, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

// Тип объединяет контент и имя типа контента (через join)
type ContentItem = Database['public']['Tables']['educational_content']['Row'] & {
  content_types: { name: string } | null
};

const LearningPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [tags, setTags] = useState<string[]>([]); // Если теги есть в базе, тоже фетчим

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // Запрос к Supabase: берем контент и название типа
      const { data, error } = await supabase
        .from('educational_content')
        .select(`
          *,
          content_types (name)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // @ts-ignore: Supabase join types can be tricky
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Фильтруем на клиенте для простоты (видео отдельно, статьи отдельно)
  const videos = content.filter(c => c.content_types?.name === 'video');
  const articles = content.filter(c => c.content_types?.name === 'article');

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-purple-600" /></div>;
  }

  return (
    <div className="pt-6 pb-20 space-y-8 bg-gray-50 min-h-screen">
      <div className="px-6">
        <h1 className="text-3xl font-black text-gray-900">Обучение</h1>
        <p className="text-gray-500 font-medium">Полезные материалы для развития</p>
      </div>

      {/* Tags (можно тоже сделать динамическими) */}
      <div className="flex gap-2 px-6 overflow-x-auto pb-2 no-scrollbar">
        {['#Аутизм', '#СДВГ', '#Логопедия'].map((tag, i) => (
          <span key={i} className="whitespace-nowrap px-4 py-2 bg-white border border-gray-100 rounded-full text-sm font-bold text-gray-600 shadow-sm cursor-pointer">
            {tag}
          </span>
        ))}
      </div>

      {/* Video Scroll */}
      {videos.length > 0 && (
        <div>
          <div className="flex justify-between items-end px-6 mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Video className="w-5 h-5 text-red-500" /> Видео-уроки
            </h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto px-6 pb-6 snap-x">
            {videos.map((v) => (
              <div key={v.id} className="snap-center shrink-0 w-72 group cursor-pointer">
                <div className="h-40 rounded-2xl bg-gray-200 relative overflow-hidden shadow-lg mb-3">
                   {/* Если есть картинка - показываем, иначе градиент */}
                   {v.thumbnail_url ? (
                     <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500"></div>
                   )}
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                       <Play className="w-5 h-5 text-gray-800 fill-gray-800 ml-1" />
                     </div>
                   </div>
                   {v.reading_time_minutes && (
                     <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold rounded-md">
                       {v.reading_time_minutes} мин
                     </span>
                   )}
                </div>
                <h3 className="font-bold text-gray-800 leading-snug group-hover:text-purple-600 transition-colors line-clamp-2">
                    {v.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Articles */}
      {articles.length > 0 && (
        <div className="px-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" /> Статьи
          </h2>
          {articles.map((a) => (
            <div key={a.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0 overflow-hidden">
                {a.thumbnail_url && <img src={a.thumbnail_url} className="w-full h-full object-cover"/>}
              </div>
              <div className="flex flex-col justify-between py-1 w-full">
                <h4 className="font-bold text-gray-800 text-sm line-clamp-2">{a.title}</h4>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{a.reading_time_minutes ? `${a.reading_time_minutes} мин` : 'Читать'}</span>
                  <span className="text-purple-500 font-bold">Открыть</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPage;