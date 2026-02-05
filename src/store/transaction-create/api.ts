import { apiClient } from '@/utils/api';
import { AxiosError } from 'axios';

export enum CreateTransactionErrorCode {
    LIMIT_MIN_AMOUNT = 'LimitMinAmount',
    LIMIT_MAX_AMOUNT = 'LimitMaxAmount'
}

interface CreateTransactionSuccessResponse {
    transactionId: string;
}

export interface CreateTransactionErrorResponse {
    errorCode: 'LimitMinAmount' | 'LimitMaxAmount';
    minAmount?: {
        value: number;
        currency: string;
    };
    maxAmount?: {
        value: number;
        currency: string;
    };
}

export const createSbpTransaction = async (publicShopId: string, orderAmount: number, orderCurrency: string) => {
    try {
        const response = await apiClient.post<CreateTransactionSuccessResponse>(
            '/transactions/sbp',
            {
                shopId: publicShopId,
                orderAmount: {
                    value: orderAmount,
                    currency: orderCurrency
                }
            }
        );

        return response.data;
    } catch (err) {
        const axiosErr = err as AxiosError<CreateTransactionErrorResponse>;

        if (axiosErr.response?.status === 400) {
            throw axiosErr.response.data;
        }

        throw err;
    }
};

interface LoadPaymentRateResponse {
    rate: number;
    orderAmount: {
        value: number;
        currency: string;
    };
    paymentAmount: {
        value: number;
        currency: string;
    };
}

export const loadSbpTransactionRate = async (
    publicShopId: string,
    orderAmount: number,
    orderCurrency: string
) => {
    const response = await apiClient.post<LoadPaymentRateResponse>(
        '/transactions/sbp/calculate',
        {
            shopId: publicShopId,
            orderAmount: {
                value: orderAmount,
                currency: orderCurrency
            }
        }
    );

    return response.data;
};