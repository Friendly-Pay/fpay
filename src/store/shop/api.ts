import { apiClient } from '@/utils/api';

export interface ShopDetailsResponse {
    id: number;
    name: string;
    description: string;
    currency?: string;
    language: string;
    supportTransactionTypes: ('sbp' | 'crypto')[];
}

/**
 * Получение информации о мерчанте
 */
export const requestShopDetails = async (shopId: string): Promise<ShopDetailsResponse> => {
    const response = await apiClient.get<ShopDetailsResponse>(`/shops/${shopId}`);
    return response.data;
};