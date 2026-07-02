import { TransactionType } from '@/store/transaction/api';
import { apiClient } from '@/utils/api';

export interface ShopDetailsResponse {
    id: number;
    name: string;
    description: string;
    currency?: string;
    language: string;
    supportedTransactionTypes: TransactionType[];
}

/**
 * Получение информации о мерчанте
 */
export const requestShopDetails = async (shopId: string): Promise<ShopDetailsResponse> => {
    const response = await apiClient.get<ShopDetailsResponse>(`/shops/${shopId}`);
    return response.data;
};
