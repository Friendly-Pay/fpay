import {
    createCardTransaction,
    createSbpTransaction,
    CreateTransactionErrorCode,
    CreateTransactionErrorResponse,
    loadSbpTransactionRate
} from './api';
import { TransactionType } from '@/store/transaction/api';
import { create } from 'zustand';

const createTransactionByType: Record<TransactionType, typeof createSbpTransaction> = {
    [TransactionType.SBP]: createSbpTransaction,
    [TransactionType.CARD]: createCardTransaction
};

export interface TransactionCreateState {
    minLimit: number | null;
    maxLimit: number | null;
    serverErrorCode: CreateTransactionErrorCode | string;
    loading: boolean;
}

interface Actions {
    createTransaction: (
        method: TransactionType,
        publicShopId: string,
        orderAmount: number,
        orderCurrency: string,
        description?: string
    ) => Promise<{ transactionId: string } | void>;
    loadTransactionRate: (
        publicShopId: string,
        orderAmount: number,
        orderCurrency: string
    ) => Promise<{ rate: number; currency: string }>;
    setLimits: (min: number, max: number) => void;
    setLoading: (loading: boolean) => void;
    setServerError: (error: CreateTransactionErrorCode) => void;
    reset: () => void;
}

export const initialState: TransactionCreateState = {
    minLimit: null,
    maxLimit: null,
    serverErrorCode: '',
    loading: false
};

export const useTransactionCreateStore = create<TransactionCreateState & Actions>((set, get) => ({
    ...initialState,

    /**
     * При успешном завершении запроса loading не будет сброшен
     */
    createTransaction: async (method, publicShopId, orderAmount, orderCurrency, description) => {
        const { loading } = get();

        if (loading) {
            return;
        }

        set({
            loading: true,
            serverErrorCode: '',
            minLimit: null,
            maxLimit: null
        });

        try {
            const res = await createTransactionByType[method](publicShopId, orderAmount, orderCurrency, description);

            return { transactionId: res.transactionId };
        } catch (err: CreateTransactionErrorResponse | any) {
            console.error('Ошибка при создании платежа', err);
            set(() => {
                if (err?.error) {
                    const data = err as CreateTransactionErrorResponse;
                    const errorCode = err.error as CreateTransactionErrorCode;

                    return {
                        minLimit: data.minAmount?.value ?? null,
                        maxLimit: data.maxAmount?.value ?? null,
                        serverErrorCode: errorCode
                    };
                }

                return {
                    serverErrorCode: 'UNKNOWN'
                };
            });
        }
    },

    loadTransactionRate: async (publicShopId, orderAmount, orderCurrency) => {
        try {
            const res = await loadSbpTransactionRate(publicShopId, orderAmount, orderCurrency);
            return {
                rate: res.rate,
                currency: res.paymentAmount.currency
            };
        } catch (error) {
            console.error('Ошибка при загрузке курса', error);
            return {
                rate: 0,
                currency: 'RUB'
            };
        }
    },

    setLimits: (min: number, max: number) => {
        set({
            minLimit: min,
            maxLimit: max
        });
    },

    setLoading: (loading: boolean) => {
        set({ loading });
    },

    setServerError: (error: CreateTransactionErrorCode | string) => {
        set({ serverErrorCode: error });
    },

    reset: () => {
        set(initialState);
    }
}));

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getTransactionCreateStore = () => useTransactionCreateStore.getState();
}
