import { create } from 'zustand';
import { supabase } from '../utils/supabase.js';

export const useAppStore = create((set, get) => ({
  initialized: false,
  user: null,
  businessLines: [],
  communities: [],
  tgUser: null,

  init: async (tg) => {
    const tgUser = tg?.initDataUnsafe?.user;
    
    if (tgUser) {
      // Upsert user in Supabase
      const { data, error } = await supabase
        .from('users')
        .upsert({
          telegram_id: tgUser.id,
          username: tgUser.username || '',
          first_name: tgUser.first_name || '',
          last_name: tgUser.last_name || '',
          language_code: tgUser.language_code || 'zh',
        }, { onConflict: 'telegram_id' })
        .select()
        .single();

      if (!error && data) {
        set({ user: data, tgUser, initialized: true });
      } else {
        // Even if Supabase fails, still initialize
        set({ tgUser, initialized: true });
      }
    } else {
      // Running outside Telegram (e.g., browser testing)
      set({ initialized: true });
    }

    // Load business lines
    const { data: blData } = await supabase
      .from('business_lines')
      .select('*')
      .order('id');
    
    if (blData) set({ businessLines: blData });
  },

  refreshData: async () => {
    const { data: blData } = await supabase
      .from('business_lines')
      .select('*')
      .order('id');
    if (blData) set({ businessLines: blData });

    const { data: cData } = await supabase
      .from('communities')
      .select('*')
      .order('created_at', { ascending: false });
    if (cData) set({ communities: cData });
  },
}));
