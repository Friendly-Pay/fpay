import { PayButton } from './PayButton';
import alfa from 'assets/banks/alfa.png';
import sber from 'assets/banks/sber.png';
import tBank from 'assets/banks/t-bank.png';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import styles from './PayBankButton.module.scss';

interface PayBankButtonProps {
    onClick?: () => void
    className?: string
};

const items = [tBank, sber, alfa];

export const PayBankButton: React.FC<PayBankButtonProps> = ({ className, onClick }) => {
    const [t] = useTranslation();
    return (
        <PayButton
            title={t('In the<br/>bank app')}
            className={cn(styles.bank, className)}
            onClick={onClick}
        >
            <div className={styles.banks}>
                {items.map((src, index) => (
                    <div
                        key={src}
                        className={styles.logo}
                        style={{ zIndex: (items.length + 1) - index }}
                    >
                        <img
                            src={src}
                            loading='lazy'
                            alt=''
                        />
                    </div>
                ))}

                <div className={styles.badgeWrap}>
                    <span
                        className={styles.badge}
                        style={{ zIndex: 1 }}
                    >
                        <span>+50</span>
                    </span>
                </div>
            </div>
        </PayButton>
    );
};