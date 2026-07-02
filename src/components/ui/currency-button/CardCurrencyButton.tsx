import { MirLogo } from '../icon/MirLogo';
import { CurrencyButton } from './CurrencyButton';
import { useTranslation } from 'react-i18next';
import styles from './CurrencyButton.module.scss';

interface CardCurrencyButtonProps {
    active?: boolean;
    className?: string;
    onClick?: () => void;
}

export const CardCurrencyButton: React.FC<CardCurrencyButtonProps> = ({ className, active, onClick }) => {
    const [t] = useTranslation();
    return (
        <CurrencyButton
            icon={<MirLogo className={styles.logo} />}
            title={t('By card')}
            text={t('MIR')}
            iconClassName={styles.iconCard}
            active={active}
            className={className}
            onClick={onClick}
        />
    );
};
