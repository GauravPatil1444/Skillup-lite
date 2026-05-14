import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  role: 'student' | 'admin';
  name?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  // Added to track if Firebase has finished its initial check
  isInitialized: boolean; 
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isInitialized: false, 
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      // Once we set the user (or null), we are initialized
      state.isInitialized = true; 
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isInitialized = true;
    },
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;