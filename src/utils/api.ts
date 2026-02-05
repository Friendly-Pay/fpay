import axios from 'axios';

enum FetchStatus {
    Idle = 'idle',
    Pending = 'pending',
    Fulfilled = 'fulfilled',
    Rejected = 'rejected',
}

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

apiClient.interceptors.request.use((config) => {
    return config;
});

apiClient.interceptors.request.use((config) => config);
apiClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

type RequestError =
    | 'NOT_FOUND'
    | 'SERVER_ERROR'
    | 'CLIENT_OFFLINE'
    | 'TIMEOUT'
    | 'UNKNOWN';

const parseRequestError = (error: unknown): RequestError => {
    // Клиент оффлайн
    if (!navigator.onLine) {
        return 'CLIENT_OFFLINE';
    }

    if (axios.isAxiosError(error)) {
        if (error.response) {
            switch (error.response.status) {
                case 404:
                    return 'NOT_FOUND';
                case 500:
                case 502:
                case 503:
                case 504:
                    return 'SERVER_ERROR';
            }
        }

        if (error.code === 'ECONNABORTED') {
            return 'TIMEOUT';
        }
    }

    return 'UNKNOWN';
};

export { apiClient, FetchStatus, parseRequestError, type RequestError };