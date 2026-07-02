import { apiClient } from '@/utils/api';

export enum TransactionType {
    SBP = 'sbp',
    CARD = 'card'
}

export enum TransactionStatus {
    CREATED = 'created',
    INITIALIZED = 'initialized',
    EXPIRED = 'expired',
    SUCCESS = 'success',
    FAILED = 'failed'
}

export interface Shop {
    id: number;
    publicId: string;
    name: string;
    description: string;
    language: string;
    siteUrl: string;
}

interface BaseTransactionResponse {
    orderId: number;
    publicId: string;
    status: TransactionStatus;
    /** Назначение платежа (может отсутствовать) */
    description?: string | null;
    /** Через сколько транзакция перейдет в статус EXPIRED */
    expireIn: number;
    orderAmount: {
        value: number;
        currency: string;
    };
    paymentAmount: {
        value: number;
        currency: string;
    };
    shop: Shop;
}

export interface SbpTransactionResponse extends BaseTransactionResponse {
    type: TransactionType.SBP;
    qrLink: string | null;
}

export interface CardTransactionResponse extends BaseTransactionResponse {
    type: TransactionType.CARD;
    formLink: string | null;
}

export type TransactionResponse = SbpTransactionResponse | CardTransactionResponse;

/**
 * Получения информации о СБП транзакции
 */
export const requestSbpTransaction = async (transactionId: string): Promise<SbpTransactionResponse> => {
    const response = await apiClient.get<SbpTransactionResponse>(`/transactions/sbp/${transactionId}`);
    return response.data;
};

/**
 * Получения информации о карточной транзакции
 */
export const requestCardTransaction = async (transactionId: string): Promise<CardTransactionResponse> => {
    const response = await apiClient.get<CardTransactionResponse>(`/transactions/card/${transactionId}`);
    return response.data;
};
