import { useLanguageSwitcher } from '@/localization/hooks';
import cn from 'classnames';
import styles from './LanguageButton.module.scss';

interface LanguageButtonProps {
    className?: string
};

export const LanguageButton: React.FC<LanguageButtonProps> = ({ className }) => {
    const { currentIcon, switchPending, switchToNextLanguage } = useLanguageSwitcher();

    const handleClick = () => {
        if (switchPending) return;
        switchToNextLanguage();
    };

    return (
        <button
            className={cn(styles.button, className)}
            onClick={handleClick}
        >
            <img
                alt=""
                loading="lazy"
                src={currentIcon}
                className={styles.icon}
            />
        </button>
    );
};