import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { Profile } from "../types";

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isOnboarded: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isOnboarded: false,

  initialize: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      set({ session, user: session?.user ?? null });

      if (session?.user) {
        await get().fetchProfile();
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      set({ isLoading: false });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session, user: session?.user ?? null });
      if (session?.user) {
        await get().fetchProfile();
      } else {
        set({ profile: null, isOnboarded: false });
      }
    });
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
    return { error: null };
  },

  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) return { error: error.message };
    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null, isOnboarded: false });
  },

  fetchProfile: async () => {
    const user = get().user;
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Fetch profile error:", error);
      return;
    }

    const profile = data as Profile;
    const isOnboarded =
      profile.preferred_categories.length > 0 && profile.difficulty_level !== null;

    set({ profile, isOnboarded });
  },

  updateProfile: async (updates) => {
    const user = get().user;
    if (!user) return { error: "Not authenticated" };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) return { error: error.message };

    await get().fetchProfile();
    return { error: null };
  },
}));
