import { PayBankButton } from '../buttons/PayBankButton';
import { QrButton } from '../buttons/QrButton';
import { ShareButton } from '../buttons/ShareButton';
import { useTransactionStore } from '@/store/transaction';
import { TransactionActions } from '@/store/transaction/actions';
import cn from 'classnames';
import styles from './PaymentOptions.module.scss';

interface PaymentOptionsProps {
    className?: string
}

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({ className }) => {
    const qrLink = useTransactionStore(state => state.qrLink);

    return (
        <div className={cn(styles.root, className)}>
            <PayBankButton
                className={styles.bank}
                onClick={TransactionActions.openNspk}
            />

            <ShareButton
                className={styles.share}
                onClick={TransactionActions.sharePaymentLink}
            />

            {qrLink && (
                <QrButton
                    nspkUrl={qrLink}
                    className={styles.qr}
                />
            )}
        </div >
    );
};