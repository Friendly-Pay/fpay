import { requestSbpTransaction, Shop, TransactionStatus } from './api';
import { FetchStatus, parseRequestError, RequestError } from '@/utils/api';
import { create } from 'zustand';

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
    status: TransactionStatus;
    expireIn: number;
    qrLink: string | null;
    /** Описание заказа, заданное мерчантом при создании платежа */
    description: string | null;
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

    // /**
    //  * Стейт загрузки для конкретной кнопки
    //  */
    // buttonLoading: 'SHARE' | false;

    // /**
    //  * Стейт загрузки при взаимодействии (над интерфейсом появляется overlay)
    //  */
    // interactionLoading: boolean;
}

interface Actions {
    loadOrder: (transactionId: string) => Promise<void>;
    resetOrder: () => void;
    updateStatus: (status: TransactionStatus) => void;
    updateRemainingTimeMs: (timeMs: number) => void;
    updateInactiveWarning: (show: boolean) => void;
    // updateButtonLoading: (button: 'PAY_BANK' | 'SHARE' | 'QR' | false) => void;
    // updateInteractionLoading: (loading: boolean) => void;
    clearError: () => void;
}

const initialState: TransactionState = {
    orderId: 0,
    transactionId: '',
    status: TransactionStatus.INITIALIZED,
    expireIn: 0,
    qrLink: '',
    description: null,
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
    // buttonLoading: false,
    // interactionLoading: false
} as const;

// export const initialState: TransactionState = {
//     orderId: 123456,
//     transactionId: 'abc123xyz789',
//     status: TransactionStatus.INITIALIZED,

//     // expireIn — в секундах, например 900 сек = 15 минут
//     expireIn: 900,

//     qrLink: 'https://qr.nspk.ru/AS10002F4G5H6I7J8K9L?type=01&bank=100000000',

//     orderAmount: {
//         value: 1000,
//         currency: 'THB'
//     },

//     paymentAmount: {
//         value: 1000,
//         currency: 'RUB'
//     },

//     merchant: {
//         id: 'merchant_001',
//         name: 'Friendly Pay Store',
//         description: 'Оплата заказа через Friendly Pay',
//         siteUrl: 'https://friendly-pay.com'
//     },

//     orderFetchStatus: FetchStatus.Fulfilled,
//     error: null,

//     // Момент получения expireIn
//     expireInReceivedAt: performance.now(),

//     // Остаток времени — для примера просто сразу считаем
//     remainingTimeMs: 0,

//     // Показываем предупреждение?
//     inactiveWarningShow: false
// };

export const useTransactionStore = create<TransactionState & Actions>(
    (set, get) => ({
        ...initialState,

        loadOrder: async (transactionId: string) => {
            if (get().orderFetchStatus === FetchStatus.Pending) {
                return;
            }

            set({
                orderFetchStatus: FetchStatus.Pending,
                error: null
            });

            try {
                const data = await requestSbpTransaction(transactionId);
                set({
                    transactionId,
                    orderId: data.orderId,
                    status: data.status as TransactionStatus,
                    expireIn: data.expireIn,
                    qrLink: data.qrLink,
                    description: data.description,
                    orderAmount: data.orderAmount,
                    paymentAmount: data.paymentAmount,
                    shop: data.shop,
                    expireInReceivedAt: performance.now(),
                    orderFetchStatus: FetchStatus.Fulfilled,
                    error: null
                });
            } catch (error: any) {
                console.error(
                    'Ошибка при загрузке информации о транзакции:',
                    error
                );
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

        // updateButtonLoading: (button) => {
        //     set({ buttonLoading: button });
        // },

        // updateInteractionLoading: (loading) => {
        //     set({ interactionLoading: loading });
        // },

        clearError: () => {
            set({ error: null });
        }
    })
);

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getTransactionStore = () => useTransactionStore.getState();
}
