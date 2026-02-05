import React from 'react';
import cn from 'classnames';
import styles from './Card.module.scss';

interface CardProps {
    /** Дополнительный CSS-класс */
    className?: string;

    /** Контент внутри карточки */
    children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>((
    { className, children },
    ref
) => {
    return (
        <div
            ref={ref}
            className={cn(styles.card, className)}
        >
            {children}
        </div>
    );
});

Card.displayName = 'Card';