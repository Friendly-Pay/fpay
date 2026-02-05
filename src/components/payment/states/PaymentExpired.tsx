import { Card } from '@/components/ui/card/Card';
import sandClockDark from 'assets/sandclock-dark.png';
import { useTranslation } from 'react-i18next';
import styles from './PaymentExpired.module.scss';

interface PaymentExpiredProps {
    className?: string
};

export const PaymentExpired: React.FC<PaymentExpiredProps> = ({ className }) => {
    const [t] = useTranslation();

    return (
        <Card className={className}>
            <div className={styles.content}>
                <div className={styles.iconWrap}>
                    <div className={styles.icon}>
                        <img
                            src={sandClockDark}
                            alt=''
                            width={88}
                            height={88}
                            loading='lazy'
                        />
                    </div>
                </div>

                <div className={styles.title}>
                    {t('Payment time has expired')}
                </div>
            </div>
        </Card>
    );
};