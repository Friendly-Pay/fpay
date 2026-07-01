import { apiClient } from '@/utils/api';

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

export interface SbpTransactionResponse {
    orderId: number;
    type: 'sbp';
    publicId: string;
    status: TransactionStatus;
    /** Через сколько транзакция перейдет в статус EXPIRED */
    expireIn: number;
    qrLink: string | null;
    /** Описание заказа, заданное мерчантом при создании платежа */
    description: string | null;
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

/**
 * Получения информации о СБП транзакции
 */
export const requestSbpTransaction = async (
    transactionId: string
): Promise<SbpTransactionResponse> => {
    const response = await apiClient.get<SbpTransactionResponse>(
        `/transactions/sbp/${transactionId}`
    );
    return response.data;

    // await new Promise(resolve => setTimeout(resolve, 500));
    // return {
    //   orderId: 123456,
    //   status: TransactionStatus.CREATED,
    //   expireIn: 120,
    //   qrLink: 'https://qr.example.com/path-to-qr',
    //   orderAmount: {
    //     value: 1000.50,
    //     currency: 'RUB'
    //   },
    //   paymentAmount: {
    //     value: 1000.50,
    //     currency: 'RUB'
    //   },
    //   shop: {
    //     id: 'merchant-001',
    //     name: 'Test Merchant',
    //     description: 'Test merchant description'
    //   }
    // };
};
