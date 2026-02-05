import { useTransactionCreateStore } from '@/store/transaction-create';
import { CURRENCY } from '@friendly-pay/currency';
import { Spinner } from '@friendly-pay/uikit/Spinner';
import { formatAmount, toMinorUnits } from '@friendly-pay/utils';
import debounce from 'debounce';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import styles from './PaymentRate.module.scss';

interface PaymentRateProps {
    shopId: string;
    orderAmount: number;
    orderCurrency: string;
    className?: string;
};

export const PaymentRate: React.FC<PaymentRateProps> = ({ shopId, orderAmount, orderCurrency, className }) => {
    const { t, i18n } = useTranslation();
    const [rate, setRate] = useState<number | null>(null);
    const [currency, setCurrency] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    const rateCurrency = CURRENCY[currency as keyof typeof CURRENCY];

    const requestId = useRef<number>(0);
    const lastOrderAmount = useRef<number | null | undefined>(null);

    const formattedAmount = rate ? formatAmount({
        value: toMinorUnits(rate, rateCurrency.minorUnits),
        currency: rateCurrency.mnemonicCode,
        codeFormat: 'symbolic',
        minority: rateCurrency.minorUnits,
        locale: i18n.language
    }).formattedWithCurrency : '';

    const loadRate = async (currentRequestId: number) => {
        const rate = await useTransactionCreateStore.getState().loadTransactionRate(shopId, orderAmount, orderCurrency);

        if (currentRequestId === requestId.current) {
            setRate(rate.rate);
            setCurrency(rate.currency);
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (!visible) {
            return null;
        }

        if (loading) {
            return (
                <div className={styles.loader}>
                    <Spinner />
                </div>
            );
        }

        return (
            <div className={styles.amount}>{t('Rate')} {formattedAmount}</div>
        );
    };

    const debouncedLoadRate = debounce(loadRate, 400);

    useEffect(() => {
        // Если сумма очищена или не валидна
        if (!orderAmount || orderAmount <= 0) {
            setVisible(false);
            setRate(null);
            setLoading(false);

            lastOrderAmount.current = orderAmount;
            return;
        }

        // Если сумма изменилась
        if (orderAmount !== lastOrderAmount.current) {
            setVisible(true);
            setLoading(true);

            requestId.current += 1;
            const currentRequestId = requestId.current;

            lastOrderAmount.current = orderAmount;

            debouncedLoadRate(currentRequestId);
        }
    }, [shopId, orderAmount, orderCurrency]);

    return (
        <div className={cn(styles.rate, className)}>
            {renderContent()}
        </div>
    );
};