import { ShopState } from '.';
import { CURRENCY } from '@friendly-pay/currency';

export const selectShop = (state: ShopState) => ({
    shopId: state.shopId,
    publicShopId: state.publicShopId,
    name: state.name,
    description: state.description,
    language: state.language
});

export const selectShopCurrency = (state: ShopState) => {
    return CURRENCY[state.currency as keyof typeof CURRENCY];
};

export const selectShopError = (state: ShopState) => {
    return state.error;
};