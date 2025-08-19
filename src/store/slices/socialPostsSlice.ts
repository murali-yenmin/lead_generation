
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// ===== Interfaces =====
export interface PostAnalytics {
    impressions: number;
    reach: number;
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
    saves: number;
    engagementRate: number;
    postContent?: string;
    imageUrl?: string;
}

export interface SocialPost {
  _id: string;
  userId: string;
  organizationId: string;
  postId: string;
  platform: string;
  postContent: string;
  imageUrl?: string | null;
  postedAt: string;
  analytics: PostAnalytics;
}

export interface AnalyticsSummary extends PostAnalytics {}

interface SocialPostsState {
  posts: SocialPost[];
  summary: AnalyticsSummary | null;
  totalPosts: number;
  platformFilter: string;
  dateRange: { from: Date | undefined, to: Date | undefined };
  isLoading: boolean;
  error: string | null;
}

// ===== Initial State =====
const initialState: SocialPostsState = {
  posts: [],
  summary: null,
  totalPosts: 0,
  platformFilter: 'all',
  dateRange: { from: undefined, to: undefined },
  isLoading: true,
  error: null,
};

// ===== Async Thunks =====
export const fetchSocialPosts = createAsyncThunk(
  'socialPosts/fetchSocialPosts',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { auth: { token }, socialPosts: postsState } = state;

    if (!token) {
      return rejectWithValue('No authentication token found.');
    }

    try {
      const params = new URLSearchParams();
      if (postsState.platformFilter !== 'all') {
        params.append('platform', postsState.platformFilter);
      }
      if (postsState.dateRange.from) {
        params.append('dateFrom', postsState.dateRange.from.toISOString());
      }
       if (postsState.dateRange.to) {
        params.append('dateTo', postsState.dateRange.to.toISOString());
      }
      
      const response = await axios.get(`/api/socialposts?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch posts.');
    }
  }
);


// ===== Slice Definition =====
const socialPostsSlice = createSlice({
  name: 'socialPosts',
  initialState,
  reducers: {
    setPlatformFilter: (state, action: PayloadAction<string>) => {
      state.platformFilter = action.payload;
    },
    setDateRange: (state, action: PayloadAction<{ from: Date | undefined, to: Date | undefined }>) => {
      state.dateRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchSocialPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSocialPosts.fulfilled, (state, action: PayloadAction<{ posts: SocialPost[], totalPosts: number, summary: AnalyticsSummary }>) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.totalPosts = action.payload.totalPosts;
        state.summary = action.payload.summary;
      })
      .addCase(fetchSocialPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
  },
});

export const { setPlatformFilter, setDateRange } = socialPostsSlice.actions;

export default socialPostsSlice.reducer;
