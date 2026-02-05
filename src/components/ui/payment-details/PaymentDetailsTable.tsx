import React, { ReactNode } from 'react';
import cn from 'classnames';
import styles from './PaymentDetailsTable.module.scss';

interface PaymentDetailsTableProps {
    children: ReactNode;
    className?: string
}

export const PaymentDetailsTable: React.FC<PaymentDetailsTableProps> = ({ children, className }) => {
    return (
        <div className={cn(styles.details, className)}>
            {children}
        </div>
    );
};