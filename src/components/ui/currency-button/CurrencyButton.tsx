import { ReactNode } from 'react';
import cn from 'classnames';
import styles from './CurrencyButton.module.scss';

interface CurrencyButtonProps {
    icon: ReactNode;
    title: string;
    text: string;
    active?: boolean;
    className?: string;
    iconClassName?: string;
    onClick?: () => void;
}

export const CurrencyButton: React.FC<CurrencyButtonProps> = ({
    icon,
    title,
    text,
    active,
    className,
    iconClassName,
    onClick
}) => {
    return (
        <button
            className={cn(styles.button, active && styles.active, className)}
            onClick={onClick}
        >
            <div className={cn(styles.icon, iconClassName)}>{icon}</div>

            <div className={styles.content}>
                <div className={styles.title}>{title}</div>

                <div className={styles.text}>{text}</div>
            </div>
        </button>
    );
};
