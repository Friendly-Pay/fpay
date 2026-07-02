import { PageContent } from '@/components/layout/PageContent';
import { FormattedAmount } from '@/components/ui/amount/FormattedAmount';
import { Card } from '@/components/ui/card/Card';
import { PaymentFailIcon } from '@/components/ui/icon/PaymentFailIcon';
import { PaymentSuccessIcon } from '@/components/ui/icon/PaymentSuccessIcon';
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

const RESULT_CONFIG: Record<
    ResultViewProps['state'],
    {
        Icon: React.FC<{ className?: string }>;
        glowClassName: string;
        labelKey: string;
    }
> = {
    SUCCESS: {
        Icon: PaymentSuccessIcon,
        glowClassName: styles.glowSuccess,
        labelKey: 'paid'
    },
    FAILED: {
        Icon: PaymentFailIcon,
        glowClassName: styles.glowFailed,
        labelKey: 'not paid'
    }
};

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

    const orderCurrency = CURRENCY[orderAmountCurrency as keyof typeof CURRENCY];
    const paymentCurrency = CURRENCY[paymentAmountCurrency as keyof typeof CURRENCY];

    const result = RESULT_CONFIG[state];
    const orderAmountVisible = orderCurrency.code !== paymentCurrency.code; // Видна ли сумма заказа

    return (
        <PageContent className={styles.root}>
            <div className={styles.icon}>
                <div className={cn(styles.glow, result.glowClassName)} />
                <result.Icon className={styles.iconImage} />
            </div>

            <div className={styles.content}>
                <div className={styles.label}>{t(result.labelKey)}</div>
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
                                positiveSymbolClassName={styles.regualar}
                            />
                        </div>
                    )}
                </div>
            </div>

            <Card className={styles.detailsCard}>
                <div className={styles.detailsContent}>
                    <div className={styles.detailsTitle}>{t('Details')}</div>

                    <div className={styles.details}>
                        <div className={styles.detailsRow}>
                            <div className={styles.detailsLabel}>{t('Merchant')}</div>
                            <div className={styles.detailsValue}>{shopName}</div>
                        </div>

                        <div className={styles.detailsRow}>
                            <div className={styles.detailsLabel}>{t('Order #')}</div>
                            <div className={styles.detailsValue}>{orderId}</div>
                        </div>

                        {description && (
                            <div className={styles.detailsRow}>
                                <div className={styles.detailsLabel}>{t('Description')}</div>
                                <div className={styles.detailsValue}>{description}</div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </PageContent>
    );
};

export default PaymentResultView;
