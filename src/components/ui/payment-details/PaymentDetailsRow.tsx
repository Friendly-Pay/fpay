import React, { ReactNode } from 'react';
import cn from 'classnames';
import styles from './PaymentDetailsRow.module.scss';

interface PaymentDetailsRowProps {
    /**
     * Текст метки (label)
     * */
    label: ReactNode;
    /**
     * Значение (value) или контент
     * */
    value?: ReactNode;
    /**
     * Ссылка для значения (если значение должно быть ссылкой)
     * */
    href?: string;
    /**
     * Текст ссылки (если отличается от value)
     * */
    linkText?: string;
    /**
     * Дополнительные параметры ссылки
     * */
    linkTarget?: '_blank' | '_self' | '_parent' | '_top';
    /**
     * Ссылаться ли на nofollow, noopener, noreferrer
     * */
    linkRel?: string;
    /**
     * CSS класс для корневого элемента
     * */
    className?: string;
    /**
     * Индивидуальный контент вместо стандартного value/href 
     * */
    children?: ReactNode;
}

export const PaymentDetailsRow: React.FC<PaymentDetailsRowProps> = ({
    label,
    value,
    href,
    linkText,
    linkTarget = '_blank',
    linkRel = 'noreferrer noopener nofollow',
    className = '',
    children
}) => {
    // Если передан children, используем его как контент
    const content = children || (
        <>
            {href ? (
                <a
                    rel={linkRel}
                    target={linkTarget}
                    href={href}
                    className={styles.link}
                >
                    {linkText || value}
                </a>
            ) : (
                <span>{value}</span>
            )}
        </>
    );

    return (
        <div className={cn(styles.detail, className)}>
            <div className={styles.label}>
                {label}
            </div>

            <div className={styles.content}>
                {content}
            </div>
        </div>
    );
};