import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

// Тип специалиста с расширенными данными профиля
type SpecialistWithProfile = Database['public']['Tables']['specialists']['Row'] & {
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  specialist_categories: {
    name: string;
  } | null;
};

interface BookingModalProps {
  specialist: SpecialistWithProfile;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ specialist, userId, onClose, onSuccess }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Собираем полную дату (в реальном проекте лучше использовать библиотеки типа date-fns)
      const appointmentDate = new Date(`${date}T${time}:00`);

      const { error: insertError } = await supabase
        .from('appointments')
        .insert({
          specialist_id: specialist.id,
          user_id: userId,
          appointment_date: appointmentDate.toISOString(),
          status: 'pending',
          notes: notes,
          duration_minutes: 60 // По умолчанию час
        });

      if (insertError) throw insertError;

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error booking:', err);
      setError('Не удалось создать запись. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h3 className="text-xl font-bold mb-1">Запись на прием</h3>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/30 overflow-hidden">
               {specialist.profiles?.avatar_url ? (
                 <img src={specialist.profiles.avatar_url} alt="Ava" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-xl">👨‍⚕️</div>
               )}
            </div>
            <div>
              <p className="font-bold text-lg">{specialist.profiles?.full_name || 'Специалист'}</p>
              <p className="text-sm opacity-90">{specialist.specialist_categories?.name}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" /> Дата приема
            </label>
            <input 
              type="date" 
              required
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" /> Время
            </label>
            <input 
              type="time" 
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Комментарий (о проблеме)
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Кратко опишите, что вас беспокоит..."
              rows={3}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                'Обработка...'
              ) : (
                <>Подтвердить запись <CheckCircle className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;