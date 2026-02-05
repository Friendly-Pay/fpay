import { requestShopDetails } from './api';
import { FetchStatus, parseRequestError, RequestError } from '@/utils/api';
import { CURRENCY } from '@friendly-pay/currency';
import { create } from 'zustand';

export interface ShopState {
    /**
     * Внутренний ID мерчанта
     */
    shopId: number;
    /**
     * Публичный ID мерчанта из URL
     * */
    publicShopId: string;
    name: string;
    /**
     * Валюта магазина, в ней создаем платеж
     */
    currency: string;
    description: string;
    language: string;
    loadStatus: FetchStatus;
    error: RequestError | null;
}

interface Actions {
    loadShop: (shopId: string) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

const DEFAULT_SHOP_CURRENCY = CURRENCY.THB.mnemonicCode;

const initialState: ShopState = {
    shopId: 0,
    publicShopId: '',
    name: '',
    currency: DEFAULT_SHOP_CURRENCY,
    description: '',
    language: 'en',
    loadStatus: FetchStatus.Idle,
    error: null,
};

export const useShopStore = create<ShopState & Actions>((set, get) => ({
    ...initialState,

    loadShop: async (publicShopId: string) => {
        if (get().loadStatus === FetchStatus.Pending) {
            return;
        }

        set({
            publicShopId: publicShopId,
            loadStatus: FetchStatus.Pending,
            error: null,
        });

        try {
            const { id, currency, ...shopDetails } = await requestShopDetails(publicShopId);
            set({
                shopId: id,
                currency: currency || DEFAULT_SHOP_CURRENCY,
                ...shopDetails,
                loadStatus: FetchStatus.Fulfilled,
                error: null,
            });
        } catch (error: any) {
            console.error('Ошибка при загрузке информации о мерчанте:', error);

            const errorCode = parseRequestError(error);
            set({
                loadStatus: FetchStatus.Rejected,
                error: errorCode,
            });
        }
    },

    reset: () => {
        set(initialState);
    },

    clearError: () => {
        set({ error: null });
    },
}));

if (import.meta.env.DEV) {
    // @ts-ignore
    window.getShopStore = () => useShopStore.getState();
}