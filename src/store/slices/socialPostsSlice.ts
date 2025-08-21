
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
    eve: number;
    postContent?: string;
    imageUrl?: string;
    leads: number; // Added
    conversionRate: number; // Added
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

export interface AnalyticsSummary {
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  saves: number;
  eve: number;
  engagementRate: number;
  totalEngagements: number;
    totalLeads: number; // Added

}


interface SocialPostsState {
  posts: SocialPost[];
  summary: AnalyticsSummary | null;
  totalPosts: number;
  page: number;
  limit: number;
  platformFilter: string;
  dateRange: { from: string | undefined, to: string | undefined };
  isLoading: boolean;
  error: string | null;
}

// ===== Initial State =====
const initialState: SocialPostsState = {
  posts: [],
  summary: null,
  totalPosts: 0,
  page: 1,
  limit: 10,
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
      const params = new URLSearchParams({
        page: postsState.page.toString(),
        limit: postsState.limit.toString(),
      });
      if (postsState.platformFilter !== 'all') {
        params.append('platform', postsState.platformFilter);
      }
      if (postsState.dateRange.from) {
        params.append('dateFrom', postsState.dateRange.from);
      }
       if (postsState.dateRange.to) {
        params.append('dateTo', postsState.dateRange.to);
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
      state.page = 1;
    },
    setDateRange: (state, action: PayloadAction<{ from: string | undefined, to: string | undefined }>) => {
      state.dateRange = action.payload;
      state.page = 1;
    },
     setSocialPostsPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSocialPostsLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1; 
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
        const summary = action.payload.summary;
        const totalEngagements = summary.likes + summary.comments + summary.shares + summary.clicks + summary.saves;
        state.summary = { ...summary, totalEngagements };
      })
      .addCase(fetchSocialPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
  },
});

export const { setPlatformFilter, setDateRange, setSocialPostsPage, setSocialPostsLimit } = socialPostsSlice.actions;

export default socialPostsSlice.reducer;
