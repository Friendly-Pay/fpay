import {
    requestCardTransaction,
    requestSbpTransaction,
    Shop,
    TransactionResponse,
    TransactionStatus,
    TransactionType
} from './api';
import { FetchStatus, parseRequestError, RequestError } from '@/utils/api';
import { create } from 'zustand';

const requestTransactionByType: Record<TransactionType, (transactionId: string) => Promise<TransactionResponse>> = {
    [TransactionType.SBP]: requestSbpTransaction,
    [TransactionType.CARD]: requestCardTransaction
};

interface Amount {
    value: number;
    currency: string;
}

export interface TransactionState {
    /**
     * Приватный ID
     */
    orderId: number;
    /**
     * Публичный ID
     */
    transactionId: string;
    type: TransactionType;
    status: TransactionStatus;
    /**
     * Назначение платежа
     */
    description: string | null;
    expireIn: number;
    qrLink: string | null;
    formLink: string | null;
    orderAmount: Amount;
    paymentAmount: Amount;
    shop: Shop;
    orderFetchStatus: FetchStatus;
    error: RequestError | null;
    expireInReceivedAt: number;

    /**
     * Оставшееся время до статуса EXPIRED
     * */
    remainingTimeMs: number;

    /**
     * Предупреждение, что скоро транзакция перейдет в статус EXPIRED
     * */
    inactiveWarningShow: boolean;
}

interface Actions {
    loadOrder: (transactionId: string, type: TransactionType) => Promise<void>;
    resetOrder: () => void;
    updateStatus: (status: TransactionStatus) => void;
    updateRemainingTimeMs: (timeMs: number) => void;
    updateInactiveWarning: (show: boolean) => void;
    clearError: () => void;
}

const initialState: TransactionState = {
    orderId: 0,
    transactionId: '',
    type: TransactionType.SBP,
    status: TransactionStatus.INITIALIZED,
    description: null,
    expireIn: 0,
    qrLink: null,
    formLink: null,
    orderAmount: {
        value: 0,
        currency: ''
    },
    paymentAmount: {
        value: 0,
        currency: ''
    },
    shop: {
        id: 0,
        publicId: '',
        name: '',
        description: '',
        language: '',
        siteUrl: ''
    },
    orderFetchStatus: FetchStatus.Idle,
    error: null,
    expireInReceivedAt: 0,
    remainingTimeMs: 0,
    inactiveWarningShow: false
} as const;

export const useTransactionStore = create<TransactionState & Actions>((set, get) => ({
    ...initialState,

    loadOrder: async (transactionId: string, type: TransactionType) => {
        if (get().orderFetchStatus === FetchStatus.Pending) {
            return;
        }

        set({
            orderFetchStatus: FetchStatus.Pending,
            error: null
        });

        try {
            const data = await requestTransactionByType[type](transactionId);

            set({
                transactionId,
                type: data.type,
                orderId: data.orderId,
                status: data.status as TransactionStatus,
                description: data.description ?? null,
                expireIn: data.expireIn,
                qrLink: data.type === TransactionType.SBP ? data.qrLink : null,
                formLink: data.type === TransactionType.CARD ? data.formLink : null,
                orderAmount: data.orderAmount,
                paymentAmount: data.paymentAmount,
                shop: data.shop,
                expireInReceivedAt: performance.now(),
                orderFetchStatus: FetchStatus.Fulfilled,
                error: null
            });
        } catch (error: any) {
            console.error('Ошибка при загрузке информации о транзакции:', error);
            const errorCode = parseRequestError(error);
            set({
                orderFetchStatus: FetchStatus.Rejected,
                error: errorCode
            });
        }
    },

    resetOrder: () => {
        set(initialState);
    },

    updateStatus: (status: TransactionStatus) => {
        set({ status });
    },

    updateRemainingTimeMs: ms => {
        set({ remainingTimeMs: ms });
    },

    updateInactiveWarning: show => {
        set({ inactiveWarningShow: show });
    },

    clearError: () => {
        set({ error: null });
    }
}));

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getTransactionStore = () => useTransactionStore.getState();
}
