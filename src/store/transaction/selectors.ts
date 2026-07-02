import { TransactionState } from '.';
import { TransactionStatus } from './api';

export const selectTransaction = (state: TransactionState) => ({
    orderId: state.orderId,
    type: state.type,
    status: state.status,
    description: state.description,
    expireIn: state.expireIn,
    qrLink: state.qrLink,
    formLink: state.formLink,
    orderAmount: state.orderAmount,
    paymentAmount: state.paymentAmount,
    shop: state.shop
});

export const selectIsTransactionActive = (state: TransactionState) => {
    const status = state.status;
    return status === TransactionStatus.CREATED || status === TransactionStatus.INITIALIZED;
};

export const selectIsTransactionExpired = (state: TransactionState) => {
    const status = state.status;
    return status === TransactionStatus.EXPIRED;
};

export const selectIsTransactionSuccess = (state: TransactionState) => {
    const status = state.status;
    return status === TransactionStatus.SUCCESS;
};

export const selectIsTransactionFailed = (state: TransactionState) => {
    const status = state.status;
    return status === TransactionStatus.FAILED;
};
