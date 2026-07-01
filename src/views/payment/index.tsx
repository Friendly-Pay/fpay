import NotFoundView from '../not-found';
import PaymentResultView from '../payment-result';
import ServerErrorView from '../server-error';
import { PageContent } from '@/components/layout/PageContent';
import { PaymentController } from '@/components/payment/controller/PaymentController';
import { PaymentHeader } from '@/components/payment/PaymentHeader';
import { PaymentExpired } from '@/components/payment/states/PaymentExpired';
import { PaymentInactiveWarning } from '@/components/payment/states/PaymentInactiveWarning.tsx';
import { PaymentOptions } from '@/components/payment/states/PaymentOptions';
import { RubleAtTheResort } from '@/components/ui/banner/PromoBanner';
import { PaymentDetails } from '@/components/ui/payment-details';
import { useTransactionStore } from '@/store/transaction';
import { TransactionStatus } from '@/store/transaction/api';
import {
    selectIsTransactionFailed,
    selectIsTransactionSuccess,
    selectTransaction
} from '@/store/transaction/selectors';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

const PaymentView: React.FC = () => {
    const [t] = useTranslation();
    const transaction = useTransactionStore(selectTransaction);
    const error = useTransactionStore(state => state.error);
    const showInactiveWarning = useTransactionStore(
        state => state.inactiveWarningShow
    );
    const isTransactionSuccess = useTransactionStore(
        selectIsTransactionSuccess
    );
    const isTransactionFailed = useTransactionStore(selectIsTransactionFailed);

    const handleHideInactiveWarning = () => {
        useTransactionStore.getState().updateInactiveWarning(false);
    };

    const renderPaymentOptions = () => {
        if (transaction.status === TransactionStatus.EXPIRED) {
            return <PaymentExpired />;
        }

        if (showInactiveWarning) {
            return (
                <PaymentInactiveWarning
                    handleReturnToPay={handleHideInactiveWarning}
                />
            );
        }

        return <PaymentOptions />;
    };

    // Ошибка загрузки
    if (error) {
        if (error === 'SERVER_ERROR') {
            return <ServerErrorView />;
        } else {
            return <NotFoundView transactionNotFound={error === 'NOT_FOUND'} />;
        }
    }

    if (isTransactionSuccess || isTransactionFailed) {
        return (
            <PaymentResultView
                state={isTransactionSuccess ? 'SUCCESS' : 'FAILED'}
                paymentAmount={transaction.paymentAmount.value}
                paymentAmountCurrency={transaction.paymentAmount.currency}
                orderAmount={transaction.orderAmount.value}
                orderAmountCurrency={transaction.orderAmount.currency}
                shopName={transaction.shop.name}
                orderId={transaction.orderId}
                description={transaction.description}
            />
        );
    }

    return (
        <>
            <PaymentController />

            <PageContent className={styles.content}>
                <div className={styles.background}></div>

                <PaymentHeader
                    title={t('Pay for order')}
                    paymentAmount={transaction.paymentAmount.value}
                    paymentAmountCurrency={transaction.paymentAmount.currency}
                    orderAmount={transaction.orderAmount.value}
                    orderAmountCurrency={transaction.orderAmount.currency}
                />

                <PaymentDetails.Table className={styles.details}>
                    <PaymentDetails.Row
                        label={t('Merchant')}
                        value={transaction.shop.name}
                        href={transaction.shop.siteUrl}
                    />

                    <PaymentDetails.Row
                        label={t('Order #')}
                        value={transaction.orderId}
                    />

                    <PaymentDetails.Row
                        label={t('Description')}
                        value={transaction.shop.description}
                    />
                </PaymentDetails.Table>

                <div className={styles.main}>{renderPaymentOptions()}</div>

                <RubleAtTheResort
                    href="https://friendlypay.io/pay"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.banner}
                />
            </PageContent>
        </>
    );
};

export default PaymentView;
