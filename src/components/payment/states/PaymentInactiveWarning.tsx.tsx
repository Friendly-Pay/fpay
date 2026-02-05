import { Card } from '@/components/ui/card/Card';
import { useTransactionStore } from '@/store/transaction';
import { Button } from '@friendly-pay/uikit/Button';
import { useTranslation } from 'react-i18next';
import styles from './PaymentInactiveWarning.module.scss';

interface PaymentInactiveWarningProps {
    className?: string
    handleReturnToPay: () => void
};

const makeTitle = (time: number) => {
    return `${String(Math.trunc(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`;
};

export const PaymentInactiveWarning: React.FC<PaymentInactiveWarningProps> = ({ className, handleReturnToPay }) => {
    const [t] = useTranslation();
    const remaningTimeMs = useTransactionStore(state => state.remainingTimeMs);
    const title = makeTitle(Math.ceil(remaningTimeMs / 1_000));

    return (
        <Card className={className}>
            <div className={styles.content}>
                <div className={styles.timer}>
                    <span>{title}</span>
                </div>

                <div className={styles.title}>{t('Payment time is expiring')}</div>
                <div className={styles.text}>{t('To complete the payment, you’ll need to enter the details again')}</div>

                <Button
                    size='52'
                    view='primary'
                    className={styles.button}
                    onClick={handleReturnToPay}
                >
                    {t('Return to payment')}
                </Button>
            </div>
        </Card>
    );
};