import React, { useEffect, useState } from 'react';
import { Loader2, Plus, PenSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import AuthGate from '../components/AuthGate';
import { useAuth } from '../context/AuthContext';
import PostItem from '../components/PostItem';
import ThreadView from '../components/ThreadView';

// Расширяем тип поста: включаем лайки текущего юзера для проверки
type PostWithData = Database['public']['Tables']['community_posts']['Row'] & {
  profiles: { full_name: string | null; avatar_url: string | null } | null;
  post_likes: { user_id: string }[]; 
};

const CommunityPage: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const isLoggedIn = !!user;

  const [posts, setPosts] = useState<PostWithData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Состояния для создания поста
  const [isCreating, setIsCreating] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  // Состояния для просмотра треда (Threads View)
  const [selectedPost, setSelectedPost] = useState<PostWithData | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [user]); // Перезагружаем при входе/выходе, чтобы обновить состояние лайков

  const fetchPosts = async () => {
    try {
      // Хитрость: мы джойним post_likes с фильтром по текущему user_id
      // Если массив post_likes не пустой -> юзер лайкнул пост
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url),
          post_likes:post_likes(user_id)
        `)
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      // Если есть юзер, фильтруем лайки по нему, если нет - пустой список лайков придет
      // (Supabase сложен в фильтрации вложенных ресурсов через JS клиент одной строкой, 
      // но post_likes(user_id) вернет ВСЕ лайки если не отфильтровать.
      // Для MVP загрузим все лайки поста, но это не идеально для big data.
      // Правильно: использовать .eq('post_likes.user_id', user.id) но это работает как Inner Join.
      // Оставим так для простоты, т.к. RLS не скрывает чужие лайки.
      
      const { data, error } = await query;

      if (error) throw error;
      if (data) {
        // Трансформируем данные, чтобы оставить только лайк текущего юзера в массиве (для PostItem)
        const formattedData = data.map((post: any) => ({
          ...post,
          post_likes: post.post_likes.filter((like: any) => like.user_id === user?.id)
        }));
        setPosts(formattedData);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user) return;
    setPosting(true);

    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          content: newPostContent,
          is_visible: true
        });

      if (error) throw error;
      
      setNewPostContent('');
      setIsCreating(false);
      await fetchPosts();
    } catch (error) {
      alert('Ошибка при публикации');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="pt-6 pb-24 bg-white min-h-screen relative">
      {/* Шапка */}
      <div className="px-6 mb-4 flex justify-between items-center sticky top-[60px] bg-white/90 backdrop-blur z-20 py-2">
        <div>
           <h1 className="text-3xl font-black text-gray-900">Темы</h1>
        </div>
        
        {/* Кнопка создания поста (Floating) */}
        {isLoggedIn && !isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Зона создания поста (появляется сверху) */}
      {isCreating && (
         <div className="px-6 mb-6 animate-fade-in">
            <div className="flex gap-4">
               <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden mb-2">
                     {/* Аватар юзера */}
                     <div className="w-full h-full bg-gradient-to-tr from-purple-400 to-pink-400"></div>
                  </div>
                  <div className="w-0.5 flex-1 bg-gray-200 rounded-full"></div>
               </div>
               
               <div className="flex-1 pb-4">
                  <p className="font-bold text-sm text-gray-900 mb-1">Вы</p>
                  <textarea 
                    value={newPostContent}
                    onChange={e => setNewPostContent(e.target.value)}
                    placeholder="Начните ветку..."
                    className="w-full text-sm outline-none placeholder-gray-400 resize-none h-20"
                    autoFocus
                  />
                  <div className="flex justify-end gap-3 mt-2">
                     <button onClick={() => setIsCreating(false)} className="text-gray-400 font-bold text-sm">Отмена</button>
                     <button 
                       onClick={handleCreatePost}
                       disabled={!newPostContent.trim() || posting}
                       className="bg-purple-600 text-white px-4 py-1.5 rounded-full font-bold text-sm disabled:opacity-50"
                     >
                        {posting ? '...' : 'Опубликовать'}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Лента */}
      <div className="w-full">
         {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-600 w-8 h-8"/></div>
         ) : posts.length === 0 ? (
            <div className="text-center py-20 px-6 text-gray-400">
               Пока тихо...
               {!isLoggedIn && <div className="mt-2 text-purple-600 cursor-pointer" onClick={openAuthModal}>Войдите, чтобы написать первым</div>}
            </div>
         ) : (
            posts.map(post => (
               <PostItem 
                 key={post.id} 
                 post={post} 
                 onCommentClick={() => setSelectedPost(post)}
               />
            ))
         )}
      </div>

      {/* Если не авторизован и хочет лайкнуть/написать (глобальный Gate внизу) */}
      {!isLoggedIn && posts.length > 0 && (
         <div className="mt-10 px-4">
            <AuthGate />
         </div>
      )}

      {/* Просмотр треда (Full Screen Modal) */}
      {selectedPost && (
         <ThreadView 
           post={selectedPost} 
           onClose={() => setSelectedPost(null)}
           onUpdatePost={fetchPosts} 
         />
      )}
    </div>
  );
};

export default CommunityPage;