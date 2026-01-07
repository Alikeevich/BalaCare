import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Loader2, ArrowLeft, Send, User } from 'lucide-react';
import { Database } from '../types/supabase';

// Типы
type Conversation = {
  id: string;
  updated_at: string;
  other_user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  last_message?: string;
};

type Message = Database['public']['Tables']['messages']['Row'];

interface ChatPageProps {
  onBack: () => void;
}

// --- КОМПОНЕНТ КОМНАТЫ ЧАТА ---
const ChatRoom = ({ conversationId, otherUser, onClose }: { conversationId: string, otherUser: any, onClose: () => void }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    // Realtime подписка на новые сообщения
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on('postgres_changes', { 
         event: 'INSERT', 
         schema: 'public', 
         table: 'messages', 
         filter: `conversation_id=eq.${conversationId}` 
      }, (payload) => {
         const newMsg = payload.new as Message;
         setMessages(prev => [...prev, newMsg]);
         scrollToBottom();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (data) {
        setMessages(data);
        scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    const content = newMessage.trim();
    setNewMessage('');

    await supabase.from('messages').insert({
      conversation_id: conversationId,
      user_id: user.id,
      content: content
    });
    
    // Обновляем время чата
    await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-slide-in-right">
       {/* Header */}
       <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-white/90 backdrop-blur shadow-sm">
          <button onClick={onClose}><ArrowLeft className="w-6 h-6"/></button>
          <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden">
             {otherUser?.avatar_url ? <img src={otherUser.avatar_url} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gradient-to-tr from-blue-400 to-green-400"></div>}
          </div>
          <span className="font-bold text-gray-900">{otherUser?.full_name || 'Собеседник'}</span>
       </div>

       {/* Messages */}
       <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f0f2f5]">
          {messages.map((msg) => {
             const isMe = msg.user_id === user?.id;
             return (
               <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                     isMe 
                       ? 'bg-purple-600 text-white rounded-tr-none' 
                       : 'bg-white text-gray-900 rounded-tl-none border border-gray-100'
                  }`}>
                     {msg.content}
                     <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-purple-200' : 'text-gray-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </div>
                  </div>
               </div>
             );
          })}
          <div ref={messagesEndRef} />
       </div>

       {/* Input */}
       <div className="p-3 bg-white border-t border-gray-100 pb-safe">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-full border border-gray-200">
             <input 
               value={newMessage}
               onChange={e => setNewMessage(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && sendMessage()}
               placeholder="Сообщение..."
               className="flex-1 bg-transparent px-3 outline-none text-sm"
             />
             <button 
               onClick={sendMessage} 
               disabled={!newMessage.trim()}
               className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white disabled:bg-gray-300 transition-colors shadow-md"
             >
                <Send className="w-4 h-4 ml-0.5" />
             </button>
          </div>
       </div>
    </div>
  );
};

// --- ОСНОВНОЙ КОМПОНЕНТ СПИСКА ЧАТОВ ---
export const ChatList = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);

  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;
    // 1. Получаем ID чатов где я участник
    const { data: myChats } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id);

    if (!myChats || myChats.length === 0) {
        setLoading(false);
        return;
    }

    const chatIds = myChats.map(c => c.conversation_id);

    // 2. Загружаем детали чатов и участников
    const { data: chats } = await supabase
      .from('conversations')
      .select(`
        id, updated_at,
        conversation_participants (
           user_id,
           profiles (id, full_name, avatar_url)
        )
      `)
      .in('id', chatIds)
      .order('updated_at', { ascending: false });

    if (chats) {
        // Форматируем: находим "другого" юзера в каждом чате
        const formatted = chats.map((chat: any) => {
           const other = chat.conversation_participants.find((p: any) => p.user_id !== user.id)?.profiles;
           return {
             id: chat.id,
             updated_at: chat.updated_at,
             other_user: other || { full_name: 'Неизвестный', avatar_url: null, id: '' }
           };
        });
        setConversations(formatted);
    }
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-purple-600"/></div>;

  return (
    <div className="pb-20">
       {conversations.length === 0 ? (
          <div className="text-center py-10 text-gray-400 px-6">
             <p>У вас пока нет чатов.</p>
             <p className="text-sm mt-2">Нажмите на аватарку пользователя в комментариях или на странице специалистов, чтобы начать диалог.</p>
          </div>
       ) : (
          <div className="space-y-1">
             {conversations.map(chat => (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChat(chat)}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100"
                >
                   <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border border-gray-100 flex-shrink-0">
                      {chat.other_user?.avatar_url ? (
                        <img src={chat.other_user.avatar_url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100"><User className="w-5 h-5 text-gray-400"/></div>
                      )}
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{chat.other_user?.full_name || 'Пользователь'}</h4>
                      <p className="text-xs text-gray-400">Нажмите, чтобы открыть чат</p>
                   </div>
                </div>
             ))}
          </div>
       )}

       {/* Окно чата (поверх всего) */}
       {activeChat && (
          <ChatRoom 
            conversationId={activeChat.id} 
            otherUser={activeChat.other_user} 
            onClose={() => { setActiveChat(null); fetchConversations(); }} 
          />
       )}
    </div>
  );
};