import { FormattedAmount } from '../ui/amount/FormattedAmount';
import { CURRENCY } from '@friendly-pay/currency';
import React from 'react';
import cn from 'classnames';
import styles from './PaymentHeader.module.scss';

interface PaymentHeaderProps {
    /** Заголовок блока */
    title: string;

    /** Сумма, которую мерчант ввёл (THB) */
    orderAmount: number;
    orderAmountCurrency: string;

    /** 
     * Сумма, которую пользователь реально платит:
     * сейчас — RUB, далее появится крипта 
     */
    paymentAmount: number;
    paymentAmountCurrency: string;

    className?: string;
}

export const PaymentHeader = React.memo<PaymentHeaderProps>(({
    title,
    orderAmount,
    orderAmountCurrency,
    paymentAmount,
    paymentAmountCurrency,
    className
}) => {
    const orderCurrency = CURRENCY[orderAmountCurrency as keyof typeof CURRENCY];
    const paymentCurrency = CURRENCY[paymentAmountCurrency as keyof typeof CURRENCY];

    // Видна ли сумма заказа
    const orderAmountVisible =
        orderCurrency.code !== paymentCurrency.code;

    return (
        <div className={cn(styles.header, className)}>
            <div className={styles.title}>{title}</div>
            <div className={styles.paymentAmount}>
                <FormattedAmount
                    value={paymentAmount}
                    currency={paymentAmountCurrency}
                    minority={paymentCurrency.minorUnits}
                    majorPartClassName={styles.bold}
                />
            </div>
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
    );
});

PaymentHeader.displayName = 'PaymentHeader';