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
        const response = await api.get<AdminUsersResponse>(`admin/admin-lists/?page=${page}`, {
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

export interface User {
    sl_no: string;
    id: string;
    user: {
        name: string;
        initials: string;
        email: string;
        profile_picture: string;
        avatar_url: string;
    };
    email: string;
    subscription: {
        name: string;
        status: string;
        plan_slug: string;
        is_free: boolean;
    };
    phone_number: string;
    date_joined: string;
    is_active: boolean;
    is_verified: boolean;
    is_disabled: boolean;
}

export interface UsersListResponse {
    success: boolean;
    users: User[];
    pagination: {
        current_page: number;
        page_size: number;
        total_pages: number;
        total_count: number;
        start_index: number;
        end_index: number;
        has_previous: boolean;
        has_next: boolean;
        previous_page: number | null;
        next_page: number | null;
        page_numbers: (number | string)[];
    };
    filter_counts: {
        all: number;
        free: number;
        subscribers: number;
    };
    current_filter: string;
}

export interface ToggleUserStatusResponse {
    success: boolean;
    error?: string;
}

export interface DeleteUserResponse {
    success: boolean;
    error?: string;
}

export const getUsers = async (page: number = 1, filter: string = 'all') => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get<UsersListResponse>(`admin/users/?page=${page}&filter=${filter}`, {
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

export const toggleUserStatus = async (userId: string, is_disabled: boolean) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.patch<ToggleUserStatusResponse>(`admin/users/${userId}/toggle-status/`, { is_disabled }, {
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

export const deleteUser = async (userId: string) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.delete<DeleteUserResponse>(`admin/users/${userId}/delete/`, {
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

export interface UpdateAdminResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        name: string;
        email: string;
        contact_number: string;
        access_level: string;
        role_display: string;
    };
}

export interface DeleteAdminResponse {
    success: boolean;
    message?: string;
}

export interface CreateAdminResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        name: string;
        email: string;
        contact_number: string;
        access_level: string;
        role_display: string;
        is_active: boolean;
        created_at: string;
    };
}

export const createAdministrator = async (data: any) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.post<CreateAdminResponse>('admin/create-admin/', data, {
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

export const updateAdministrator = async (id: number | string, data: any) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.patch<UpdateAdminResponse>(`admin/administrators/${id}/`, data, {
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

export const deleteAdministrator = async (id: number | string) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.delete<DeleteAdminResponse>(`admin/administrators/${id}/delete/`, {
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

export interface Payment {
    payment_serial_no: string;
    user_name: string;
    user_id: string;
    email: string;
    amount: string;
    amount_raw: number;
    currency: string;
    status: string;
    payment_method: string;
    plan_name: string;
    created_at: string;
    stripe_payment_intent_id: string;
}

export interface PaymentsResponse {
    success: boolean;
    payments: Payment[];
    pagination: {
        current_page: number;
        page_size: number;
        total_pages: number;
        total_count: number;
        start_index: number;
        end_index: number;
        has_previous: boolean;
        has_next: boolean;
        previous_page: number | null;
        next_page: number | null;
        page_numbers: (number | string)[];
    };
    status_counts: {
        all: number;
        succeeded: number;
        pending: number;
        failed: number;
    };
}

export const getPayments = async (page: number = 1) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get<PaymentsResponse>(`admin/payments/?page=${page}`, {
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

export interface SubscriptionStatItem {
    value: string;
    raw_value: number;
    change: string;
    change_value: number;
    trend: string;
    this_month?: number;
    last_month?: number;
    is_positive?: boolean;
}

export interface SubscriptionDashboardResponse {
    success: boolean;
    stats: {
        total_revenue: SubscriptionStatItem;
        active_subs: SubscriptionStatItem;
        churn_rate: SubscriptionStatItem;
        mrr: SubscriptionStatItem;
    };
    period: {
        current_month: string;
        previous_month: string;
    };
}

export const getSubscriptionDashboard = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get<SubscriptionDashboardResponse>('admin/subscriptions-dashboard/', {
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

export interface SubscriptionPlan {
    id: string;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    plan_type: string;
    price: string;
    currency: string;
    interval: string;
    interval_count: number;
    trial_period_days: number;
    features: string[];
    max_api_calls: number;
    max_users: number;
    max_projects: number;
    max_storage_gb: number;
    is_featured: boolean;
    is_popular: boolean;
    badge_text: string | null;
    is_lifetime: boolean;
    is_recurring: boolean;
    is_unlimited_api: boolean;
    display_price: string;
    discount_percentage: number;
    subscriber_count: number;
    trialing_count: number;
    stripe_synced: boolean;
    has_trial: boolean;
    is_deleted: boolean;
}

export interface SubscriptionPlansResponse {
    success: boolean;
    count: number;
    plans: SubscriptionPlan[];
}

export const getSubscriptionPlans = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get<SubscriptionPlansResponse>('payment/admin/plans/', {
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

export const getSubscriptionPlan = async (id: string) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get<SubscriptionPlan>(`payment/admin/plans/${id}/`, {
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

export interface CreatePlanData {
    name: string;
    slug: string;
    price: number;
    plan_type: string;
    interval?: string;
    interval_count?: number;
    trial_period_days?: number;
}

export interface UpdatePlanData {
    name?: string;
    slug?: string;
    price?: number;
    plan_type?: string;
    interval?: string;
    interval_count?: number;
    trial_period_days?: number;
}

export const createSubscriptionPlan = async (data: CreatePlanData) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.post('payment/admin/plans/', data, {
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

export const updateSubscriptionPlan = async (id: string, data: UpdatePlanData) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.patch(`payment/admin/plans/${id}/`, data, {
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

export const deleteSubscriptionPlan = async (id: string) => {
    try {
        const token = localStorage.getItem('accessToken');
        await api.delete(`payment/admin/plans/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data as LoginError;
        }
        throw { error: 'An unexpected error occurred' };
    }
};

export const bulkSyncPlans = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.post('payment/admin/plans/bulk-sync/', {}, {
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

export interface BulkDeletePlansRequest {
    plan_ids: string[];
}

export const bulkDeletePlans = async (data: BulkDeletePlansRequest) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.post('payment/admin/plans/bulk-delete/', data, {
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

export interface ChartDataPoint {
    month: string;
    month_full: string;
    month_num: number;
    year: number;
    new_subscriptions: number;
    canceled: number;
    net_growth: number;
    label: string;
}

export interface ChartSummary {
    total_new_subscriptions: number;
    total_canceled: number;
    net_growth: number;
    average_monthly_new: number;
    average_monthly_canceled: number;
    churn_rate: number;
}

export interface ChartPeriod {
    start: string;
    end: string;
    months_count: number;
}

export interface SubscriptionChartResponse {
    success: boolean;
    chart_data: ChartDataPoint[];
    summary: ChartSummary;
    period: ChartPeriod;
}

export const getSubscriptionChartData = async (months: number = 12) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get<SubscriptionChartResponse>('admin/subscriptions-chart/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { months }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data as LoginError;
        }
        throw { error: 'An unexpected error occurred' };
    }
};

export interface SubscriptionItem {
    id: string;
    customer_email: string;
    customer_name: string;
    plan: {
        id: string;
        name: string;
        slug: string;
    };
    status: string;
    is_trial: boolean;
    stripe_subscription_id: string | null;
    current_period_start: string;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
    created_at: string;
}

export interface SubscriptionListResponse {
    success: boolean;
    total: number;
    page: number;
    limit: number;
    pages: number;
    has_next: boolean;
    has_previous: boolean;
    subscriptions: SubscriptionItem[];
}

export const getSubscriptions = async (page: number = 1, limit: number = 10) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get<SubscriptionListResponse>(`payment/admin/subscriptions/?page=${page}&limit=${limit}`, {
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

export interface CustomerItem {
    id: string;
    email: string;
    name: string | null;
    stripe_customer_id: string;
    has_active_subscription: boolean;
    subscription_status: string;
    delinquent: boolean;
    created_at: string;
}

export interface CustomerListResponse {
    success: boolean;
    total: number;
    page: number;
    per_page: number;
    customers: CustomerItem[];
}

export const getCustomers = async (page: number = 1, limit: number = 20) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get<CustomerListResponse>(`payment/admin/customers/?page=${page}&limit=${limit}`, {
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

export interface ApiKeyItem {
    key: string;
    label: string;
    category: string;
    value: string;
    is_set: boolean;
    should_mask: boolean;
}

export interface ApiKeysResponse {
    success: boolean;
    api_keys: ApiKeyItem[];
    grouped: Record<string, ApiKeyItem[]>;
    categories: string[];
    total_count: number;
    configured_count: number;
}

export const getApiKeys = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get<ApiKeysResponse>('admin/api-keys/', {
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

export interface UpdateApiKeyResponse {
    success: boolean;
    message: string;
    api_key: ApiKeyItem;
    note?: string;
}

export const updateApiKey = async (key: string, value: string) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.patch<UpdateApiKeyResponse>(`admin/api-keys/${key}/update/`, { value }, {
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

export interface PrivacyPolicyData {
    id: number;
    version: string;
    title: string;
    content: string;
    effective_date: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PrivacyPolicyResponse {
    success: boolean;
    message?: string;
    data: PrivacyPolicyData;
}

export const getPrivacyPolicy = async (id: number) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get<PrivacyPolicyResponse>(`authentication/privacy-policy/${id}/`, {
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

export const updatePrivacyPolicy = async (id: number, data: Partial<{ content: string; version: string; effective_date: string; title: string; is_active: boolean }>) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.patch<PrivacyPolicyResponse>(`authentication/privacy-policy/${id}/`, data, {
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

export interface TermsConditionsData {
    id: number;
    version: string;
    title: string;
    content: string;
    effective_date: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface TermsConditionsResponse {
    success: boolean;
    message?: string;
    data: TermsConditionsData;
}

export const getTermsConditions = async (id: number) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get<TermsConditionsResponse>(`authentication/terms-and-conditions/${id}/`, {
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

export const updateTermsConditions = async (id: number, data: Partial<{ content: string; version: string; effective_date: string; title: string; is_active: boolean }>) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.patch<TermsConditionsResponse>(`authentication/terms-and-conditions/${id}/`, data, {
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

