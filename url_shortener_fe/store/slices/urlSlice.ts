import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/apiHandler';
import { CreateUrlPayload, UrlInterface, UrlsStatistics, PaginationInfo, PaginatedUrlsResponse } from '@/types/urlTypes';

interface UrlState {
    urls: UrlInterface[] | null;
    recentUrl: UrlInterface | null;
    statistics: UrlsStatistics | null;
    pagination: PaginationInfo | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: UrlState = {
    urls: null,
    recentUrl: null,
    statistics: {
        totalUrls: 0,
        totalClicks: 0,
        activeUrls: 0,
    },
    pagination: null,
    loading: false,
    error: null,
    success: false,
};


export const createUrl = createAsyncThunk(
    'urls/createUrl',
    async (urlData: CreateUrlPayload, { rejectWithValue }) => {
        try {
            const response = await api.post<any>('/urls', urlData);

            if (!response.isSuccess) {
                // Check if this is a 409 conflict (URL already exists)
                if (response.status === 409 && response.data?.url) {
                    // Return the existing URL data instead of rejecting
                    return {
                        status: 'exists',
                        url: response.data.url
                    };
                }
                return rejectWithValue(response.error);
            }
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to create url');
        }
    }
);


export const fetchUrls = createAsyncThunk(
    'urls/fetchUrls',
    async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
        try {
            const response = await api.get<any>(`/urls?page=${page}&limit=${limit}`);

            if (!response.isSuccess) {
                return rejectWithValue(response.error);
            }

            // Make sure we're returning the correct structure
            return {
                urls: response.data.urls || [],
                pagination: response.data.pagination || {
                    total: 0,
                    page: page,
                    limit: limit,
                    totalPages: 0
                }
            };
        } catch (error) {
            return rejectWithValue('Failed to fetch urls');
        }
    }
);

export const fetchUrlStatistics = createAsyncThunk(
    'urls/fetchUrlStatistics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<any>('/urls/statistics');

            if (!response.isSuccess) {
                return rejectWithValue(response.error);
            }

            return response.data
        } catch (error) {
            return rejectWithValue('Failed to fetch url statistics');
        }
    }
);

const urlSlice = createSlice({
    name: 'urls',
    initialState,
    reducers: {
        resetUrlState: (state) => {
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createUrl.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(createUrl.fulfilled, (state, action: PayloadAction<any | null>) => {
            state.loading = false;
            if (action.payload) {
                // Check if this is an existing URL response
                if (action.payload.status === 'exists') {
                    state.recentUrl = action.payload.url;
                    state.error = "URL already exists";
                    state.success = false;
                } else {
                    state.urls?.push(action.payload.url);
                    state.recentUrl = action.payload.url;
                    state.success = true;
                }
            }
        });
        builder.addCase(createUrl.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Handle fetchUrls
        builder.addCase(fetchUrls.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUrls.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.urls = action.payload.urls;
            state.pagination = action.payload.pagination;
            state.success = true;
        });
        builder.addCase(fetchUrls.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Handle fetchUrlStatistics
        builder.addCase(fetchUrlStatistics.pending, (state) => {
            state.loading = true;
            state.error = null;
        }
        );
        builder.addCase(fetchUrlStatistics.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.statistics = action.payload.statistics;
            state.success = true;
        }
        );
        builder.addCase(fetchUrlStatistics.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        }
        );
    },
});

export const { resetUrlState } = urlSlice.actions;
export default urlSlice.reducer;