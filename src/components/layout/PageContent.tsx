import { PropsWithChildren } from 'react';
import cn from 'classnames';
import styles from './PageContent.module.scss';

interface PageContentProps {
    className?: string
};

export const PageContent: React.FC<PropsWithChildren<PageContentProps>> = ({ children, className }) => {
    return (
        <div className={cn(styles.pageContent, className)}>
            {children}
        </div>
    );
};