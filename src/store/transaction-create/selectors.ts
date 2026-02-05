import { TransactionCreateState } from '.';

export const selectTransactionCreateServerError = (state: TransactionCreateState) => {
    return state.serverErrorCode;
};