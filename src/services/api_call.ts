import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://10.10.7.85:12005/api/';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface LoginResponse {
    message: string;
    data: {
        tokens: {
            refresh: string;
            access: string;
        };
        user: {
            id: number;
            email: string;
            username: string;
            name: string;
            role: string;
        };
    };
}

export interface LoginError {
    error: string;
    details?: Record<string, string[]>;
}

export interface PasswordResetResponse {
    message: string;
}

export interface VerifyOtpResponse {
    message: string;
    data: {
        reset_token: string;
    };
}

export interface ResetPasswordResponse {
    message: string;
    data: {
        tokens: {
            refresh: string;
            access: string;
        };
    };
}

export interface DashboardOverviewResponse {
    message: string;
    data: {
        greeting: string;
        admin_name: string;
        admin_role: string;
        stats: {
            total_users: number;
            total_subscribers: number;
            new_users: number;
        };
        detailed_stats: {
            users: {
                total: number;
                active: number;
                inactive: number;
                verified: number;
                unverified: number;
                with_profile_picture: number;
            };
            subscribers: {
                total: number;
                free_users: number;
                new_last_7_days: number;
                conversion_rate: number;
            };
            growth: {
                new_users_last_7_days: number;
                new_users_last_30_days: number;
            };
            users_by_role: Record<string, number>;
        };
        generated_at: string;
    };
}

export interface ProfileResponse {
    message: string;
    data: {
        id: number;
        name: string;
        email: string;
        phone: string;
        image: string | null;
        role: string;
        role_display: string;
        is_verified: boolean;
        date_joined: string;
        last_login: string;
        available_roles: {
            value: string;
            label: string;
        }[];
    };
}

export interface ChangePasswordResponse {
    message: string;
}

export interface AdminUsersResponse {
    message: string;
    data: {
        users: {
            id: number;
            name: string;
            email: string;
            phone: string;
            image: string | null;
            access_level: string;
            is_active: boolean;
            date_joined: string;
        }[];
        pagination: {
            current_page: number;
            per_page: number;
            total: number;
            total_pages: number;
            start_index: number;
            end_index: number;
            has_prev: boolean;
            has_next: boolean;
        };
    };
}

export const login = async (email: string, password: string, remember_me: boolean = false) => {
    try {
        const response = await api.post<LoginResponse>('admin/login/', {
            email,
            password,
            remember_me,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data as LoginError;
        }
        throw { error: 'An unexpected error occurred' };
    }
};

export const sendPasswordResetOtp = async (email: string) => {
    try {
        const response = await api.post<PasswordResetResponse>('admin/send-passwordreset-otp/', {
            email,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data as LoginError;
        }
        throw { error: 'An unexpected error occurred' };
    }
};

export const verifyPasswordResetOtp = async (email: string, otp: string) => {
    try {
        const response = await api.post<VerifyOtpResponse>('admin/verify-passwordreset-otp/', {
            email,
            otp,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data as LoginError;
        }
        throw { error: 'An unexpected error occurred' };
    }
};

export const resetPassword = async (token: string, password: string) => {
    try {
        const response = await api.post<ResetPasswordResponse>('admin/set-password/', {
            token,
            password1: password,
            password2: password,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data as LoginError;
        }
        throw { error: 'An unexpected error occurred' };
    }
};

export const getDashboardOverview = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get<DashboardOverviewResponse>('admin/dashboard/overview/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data as LoginError;
        }
        throw { error: 'An unexpected error occurred' };
    }
};

export const getProfile = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get<ProfileResponse>('admin/profile/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data as LoginError;
        }
        throw { error: 'An unexpected error occurred' };
    }
};

export const updateProfile = async (formData: FormData) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.patch<ProfileResponse>('admin/profile/', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data as LoginError;
        }
        throw { error: 'An unexpected error occurred' };
    }
};

export const changePassword = async (old_password: string, new_password: string, confirm_password: string) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.post<ChangePasswordResponse>('authentication/change-password/', {
            old_password,
            new_password,
            confirm_password,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data as LoginError;
        }
        throw { error: 'An unexpected error occurred' };
    }
};

export const getAdminUsers = async (page: number = 1) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get<AdminUsersResponse>(`admin/user-lists/?page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data as LoginError;
        }
        throw { error: 'An unexpected error occurred' };
    }
};

export default api;
