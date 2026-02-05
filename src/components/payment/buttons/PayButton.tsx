import { PropsWithChildren } from 'react';
import cn from 'classnames';
import styles from './PayButton.module.scss';

interface PayButtonProps {
    title: string
    className?: string
    onClick?: () => void
};

export const PayButton: React.FC<PropsWithChildren<PayButtonProps>> = ({ title, className, children, onClick }) => {
    return (
        <div
            className={cn(styles.button, className)}
            style={{ backgroundColor: 'var(--color-background-neutral)' }}
            onClick={onClick}
        >
            <div
                className={styles.title}
                dangerouslySetInnerHTML={{ __html: title }}
            />

            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};