import { StatusIcon } from './StatusIcon';
import { FormattedAmount } from '@/components/ui/amount/FormattedAmount';
import { Card } from '@/components/ui/card/Card';
import { PaymentDetails } from '@/components/ui/payment-details';
import { CURRENCY } from '@friendly-pay/currency';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import styles from './styles.module.scss';

interface ResultViewProps {
    state: 'SUCCESS' | 'FAILED';

    /** Сумма, которую мерчант ввёл (THB) */
    orderAmount: number;
    orderAmountCurrency: string;

    /**
     * Сумма, которую пользователь реально платит:
     * сейчас — RUB, далее появится крипта
     */
    paymentAmount: number;
    paymentAmountCurrency: string;

    shopName: string;
    orderId: number;
    /** Описание заказа, заданное мерчантом при создании платежа */
    description: string | null;
}

const PaymentResultView: React.FC<ResultViewProps> = ({
    state,
    orderAmount,
    orderAmountCurrency,
    paymentAmount,
    paymentAmountCurrency,
    shopName,
    orderId,
    description
}) => {
    const [t] = useTranslation();

    const orderCurrency =
        CURRENCY[orderAmountCurrency as keyof typeof CURRENCY];
    const paymentCurrency =
        CURRENCY[paymentAmountCurrency as keyof typeof CURRENCY];

    // Видна ли сумма заказа
    const orderAmountVisible = orderCurrency.code !== paymentCurrency.code;

    const isSuccess = state === 'SUCCESS';

    return (
        <div className={styles.root}>
            <div className={styles.icon}>
                <div
                    className={cn(
                        styles.glow,
                        isSuccess ? styles.glowSuccess : styles.glowFailed
                    )}
                />
                <StatusIcon
                    variant={isSuccess ? 'success' : 'failed'}
                    aria-hidden
                    className={styles.iconImage}
                />
            </div>

            <div className={styles.content}>
                <div className={styles.label}>
                    {t(isSuccess ? 'paid' : 'not paid')}
                </div>
                <div className={styles.paymentAmount}>
                    <FormattedAmount
                        value={paymentAmount}
                        currency={paymentAmountCurrency}
                        minority={paymentCurrency.minorUnits}
                        minorPartClassName={styles.bold}
                        majorPartClassName={styles.bold}
                        currencyClassName={styles.bold}
                        currencySeparatorClassName={styles.bold}
                        positiveSymbolClassName={styles.bold}
                    />

                    {orderAmountVisible && (
                        <div className={styles.orderAmount}>
                            <FormattedAmount
                                value={orderAmount}
                                currency={orderAmountCurrency}
                                minority={orderCurrency.minorUnits}
                                minorPartClassName={styles.regualar}
                                majorPartClassName={styles.regualar}
                                currencyClassName={styles.regualar}
                                currencySeparatorClassName={styles.regualar}
                                positiveSymbolClassName={styles.regular}
                            />
                        </div>
                    )}
                </div>
            </div>

            <Card className={styles.detailsCard}>
                <div className={styles.detailsContent}>
                    <div className={styles.detailsTitle}>{t('Details')}</div>

                    <PaymentDetails.Table>
                        <PaymentDetails.Row
                            stacked
                            label={t('Merchant')}
                            value={shopName}
                        />

                        <PaymentDetails.Row
                            stacked
                            label={t('Order #')}
                            value={orderId}
                        />

                        {description && (
                            <PaymentDetails.Row
                                stacked
                                label={t('Description')}
                                value={description}
                            />
                        )}
                    </PaymentDetails.Table>
                </div>
            </Card>
        </div>
    );
};

export default PaymentResultView;
