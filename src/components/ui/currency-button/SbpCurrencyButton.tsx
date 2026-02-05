import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import styles from './CurrencyButton.module.scss';

interface CurrencyButtonProps {
    active?: boolean
    className?: string
    onClick?: () => void
}

// @TODO сделать чтобы принимал разные валюты
export const SbpCurrencyButton: React.FC<CurrencyButtonProps> = ({ className, active, onClick }) => {
    const [t] = useTranslation();
    return (
        <button
            className={cn(styles.button, active && styles.active, className)}
            onClick={onClick}
        >
            <div className={styles.icon}>
                <Sbp />
            </div>

            <div className={styles.content}>
                <div
                    className={styles.title}
                >
                    {t('Rubles')}
                </div>

                <div
                    className={styles.text}
                >
                    {t('Use SBP')}
                </div>
            </div>
        </button>
    );
};

const Sbp = () => {
    return (
        <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15.4582 20.0508L12.1975 21.9521L9.17188 27.2508L21.514 20.0508H15.4582Z"
                fill="#874691"
            />
            <path
                d="M24.7746 14.6211L21.5138 16.5225L18.4883 21.8211L30.8258 14.6211H24.7746Z"
                fill="#DA1844"
            />
            <path
                d="M21.5138 12.7206L18.4883 7.42188V18.2849V21.822V32.685L21.5138 27.3863V12.7206Z"
                fill="#F9B229"
            />
            <path
                d="M18.4883 7.42188L21.5138 12.7206L24.7746 14.6219H30.8258L18.4883 7.42188Z"
                fill="#F07F1A"
            />
            <path
                d="M18.4883 18.2852V32.6853L21.5138 27.3866V23.5792L18.4883 18.2852Z"
                fill="#72B22C"
            />
            <path
                d="M24.7746 25.4844L21.5138 27.3857L18.4883 32.6844L30.8258 25.4844H24.7746Z"
                fill="#00743E"
            />
            <path
                d="M9.17188 12.8516V27.2517L12.1975 21.953V18.1502L9.17188 12.8516Z"
                fill="#5F5A94"
            />
            <path
                d="M18.7892 18.1194V18.124L9.47266 12.6855L12.4982 17.9842L25.0756 25.3194H31.1267L18.7892 18.1194Z"
                fill="#0D90CD"
            />
        </svg>
    );
};