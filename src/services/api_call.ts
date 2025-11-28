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
            role: string;
        };
    };
}

export interface LoginError {
    error: string;
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

export default api;
