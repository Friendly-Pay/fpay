const Routes = {
    CREATE_PAYMENT: '/shop/:name',
    SBP_PAYMENT: '/sbp/:transactionId',

    LOGIN: '/auth/login',
    SMS_VERIFICATION: '/auth/step',
    DASHBOARD_MERCHANT: '/merchant/dashboard',
    DASHBOARD_MERCHANT_SHOP: '/merchant/dashboard/:shopId',
    DASHBOARD_AGENT: '/agent/dashboard'
} as const;

const buildRoute = {
    createPayment: (name: string) => `/shop/${encodeURIComponent(name)}`,
    sbpPayment: (transactionId: string) => `/sbp/${encodeURIComponent(transactionId)}`,
    merchantShop: (shopId: number) => `${import.meta.env.VITE_DASHBOARD_DOMAIN}/merchant/dasboard/${shopId}`
} as const;

const getCurrentRoute = (pathname: string) => {
    if (/^\/shop\/[^/]+$/.test(pathname)) {
        const publicShopId = decodeURIComponent(pathname.split('/')[2] ?? '');
        return {
            route: Routes.CREATE_PAYMENT,
            publicShopId
        };
    }

    if (/^\/sbp\/[^/]+$/.test(pathname)) {
        const transactionId = decodeURIComponent(pathname.split('/')[2] ?? '');
        return {
            route: Routes.SBP_PAYMENT,
            transactionId
        };
    }
};

export { buildRoute, getCurrentRoute, Routes };