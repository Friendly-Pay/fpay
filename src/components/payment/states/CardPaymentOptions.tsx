import { MirButton } from '../buttons/MirButton';
import { useTransactionStore } from '@/store/transaction';
import { TransactionActions } from '@/store/transaction/actions';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import styles from './CardPaymentOptions.module.scss';

interface CardPaymentOptionsProps {
    className?: string;
}

export const CardPaymentOptions: React.FC<CardPaymentOptionsProps> = ({ className }) => {
    const [t] = useTranslation();
    const formLink = useTransactionStore(state => state.formLink);

    return (
        <div className={cn(styles.root, className)}>
            <div className={styles.title}>{t('By bank card')}</div>

            <MirButton
                disabled={!formLink}
                onClick={TransactionActions.openBankPage}
            />

            <div className={styles.hint}>{t('Paying by MIR card, you will be redirected to the bank page')}</div>
        </div>
    );
};
