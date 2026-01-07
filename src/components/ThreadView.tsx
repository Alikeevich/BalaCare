import React, { useEffect, useState } from 'react';
import { X, Loader2, User, CornerDownRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import PostItem from './PostItem';
import { Database } from '../types/supabase';

type PostWithData = Database['public']['Tables']['community_posts']['Row'] & {
  profiles: { full_name: string | null; avatar_url: string | null } | null;
  post_likes: { user_id: string }[];
};

type CommentWithProfile = Database['public']['Tables']['post_comments']['Row'] & {
  profiles: { full_name: string | null; avatar_url: string | null } | null;
  children?: CommentWithProfile[]; // Для рекурсии
};

interface ThreadViewProps {
  post: PostWithData;
  onClose: () => void;
  onPostUpdate: (postId: string, newLikeCount: number, isLiked: boolean) => void;
  onCommentAdded: () => void;
  onStartChat: (targetUserId: string) => void; // НОВАЯ ФУНКЦИЯ: Начать чат
}

const ThreadView: React.FC<ThreadViewProps> = ({ post, onClose, onPostUpdate, onCommentAdded, onStartChat }) => {
  const { user, openAuthModal } = useAuth();
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Состояния для отправки
  const [newComment, setNewComment] = useState('');
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url)
      `)
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });

    if (error) console.error(error);
    if (data) {
      // Строим дерево комментариев
      const commentsByParent: Record<string, CommentWithProfile[]> = {};
      const rootComments: CommentWithProfile[] = [];

      data.forEach((c: any) => {
        c.children = [];
        if (c.parent_id) {
          if (!commentsByParent[c.parent_id]) commentsByParent[c.parent_id] = [];
          commentsByParent[c.parent_id].push(c);
        } else {
          rootComments.push(c);
        }
      });

      // Рекурсивная функция для сборки
      const buildTree = (nodes: CommentWithProfile[]) => {
        nodes.forEach(node => {
          if (commentsByParent[node.id]) {
            node.children = commentsByParent[node.id];
            buildTree(node.children);
          }
        });
      };

      buildTree(rootComments);
      setComments(rootComments);
    }
    setLoading(false);
  };

  const handleSendComment = async () => {
    if (!user) return openAuthModal();
    if (!newComment.trim()) return;
    
    setSending(true);
    try {
      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: post.id,
          user_id: user.id,
          content: newComment,
          parent_id: replyTo?.id || null // Указываем родителя если это ответ
        });

      if (error) throw error;
      
      setNewComment('');
      setReplyTo(null);
      await fetchComments(); 
      onCommentAdded();
    } catch (err) {
      alert('Ошибка при отправке');
    } finally {
      setSending(false);
    }
  };

  // Рекурсивный рендер комментария
  const CommentNode = ({ comment, depth = 0 }: { comment: CommentWithProfile, depth?: number }) => (
    <div className={`relative ${depth > 0 ? 'ml-6 mt-3' : 'mt-4'}`}>
       {depth > 0 && <div className="absolute -left-4 top-4 w-3 h-px bg-gray-300"></div>}
       {depth > 0 && <div className="absolute -left-4 -top-2 bottom-4 w-px bg-gray-300"></div>}
       
       <div className="flex gap-3">
          <div 
            className="flex-shrink-0 cursor-pointer" 
            onClick={() => comment.user_id !== user?.id && onStartChat(comment.user_id || '')} // Клик по аве -> Чат
          >
             <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
               {comment.profiles?.avatar_url ? (
                 <img src={comment.profiles.avatar_url} className="w-full h-full object-cover" alt="User" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-50"><User className="w-4 h-4 text-gray-400"/></div>
               )}
             </div>
          </div>
          <div className="flex-1 bg-gray-50 p-3 rounded-2xl rounded-tl-none">
             <div className="flex justify-between items-start">
                <span className="font-bold text-sm text-gray-900">{comment.profiles?.full_name || 'Аноним'}</span>
                <span className="text-xs text-gray-400">{new Date(comment.created_at || '').toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
             </div>
             <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{comment.content}</p>
             <button 
               onClick={() => setReplyTo({ id: comment.id, name: comment.profiles?.full_name || 'Аноним' })}
               className="text-xs font-bold text-purple-600 mt-1 hover:underline"
             >
               Ответить
             </button>
          </div>
       </div>
       
       {/* Рендер детей */}
       {comment.children && comment.children.length > 0 && (
         <div className="border-l-2 border-gray-100 ml-4 pl-0">
            {comment.children.map(child => <CommentNode key={child.id} comment={child} depth={depth + 1} />)}
         </div>
       )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <X className="w-6 h-6 text-gray-900" />
        </button>
        <h2 className="font-bold text-lg">Обсуждение</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-32"> {/* Большой отступ снизу для инпута */}
        <div className="pt-2">
           <PostItem post={post} isDetailView={true} onPostUpdate={onPostUpdate} />
           
           {/* Кнопка "Написать сообщение автору" */}
           {post.user_id !== user?.id && (
             <div className="px-4 pb-2">
                <button 
                   onClick={() => post.user_id && onStartChat(post.user_id)}
                   className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold"
                >
                   Написать сообщение автору
                </button>
             </div>
           )}
        </div>

        <div className="h-px bg-gray-100 w-full my-2"></div>

        <div className="px-4 pb-4">
          {loading ? (
             <div className="flex justify-center py-4"><Loader2 className="animate-spin text-purple-600"/></div>
          ) : comments.length === 0 ? (
             <p className="text-gray-400 text-center py-4 text-sm">Пока нет комментариев. Начните ветку!</p>
          ) : (
            comments.map((comment) => (
              <CommentNode key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </div>

      {/* Input Area (Sticky Bottom) */}
      <div className="border-t border-gray-200 bg-white p-3 fixed bottom-0 left-0 right-0 z-20 pb-safe">
        {replyTo && (
           <div className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded-t-lg text-xs text-gray-600">
              <span className="flex items-center gap-1"><CornerDownRight className="w-3 h-3"/> Ответ для <b>{replyTo.name}</b></span>
              <button onClick={() => setReplyTo(null)}><X className="w-3 h-3"/></button>
           </div>
        )}
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-purple-400 transition-all shadow-sm">
           <input 
             value={newComment}
             onChange={e => setNewComment(e.target.value)}
             placeholder={replyTo ? "Ваш ответ..." : "Оставьте комментарий..."}
             className="flex-1 bg-transparent text-sm focus:outline-none placeholder-gray-400 px-2 py-1"
             onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
           />
           <button 
             onClick={handleSendComment}
             disabled={!newComment.trim() || sending}
             className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
           >
             {sending ? <Loader2 className="w-4 h-4 animate-spin"/> : <CornerDownRight className="w-4 h-4" />}
           </button>
        </div>
      </div>
    </div>
  );
};

export default ThreadView;