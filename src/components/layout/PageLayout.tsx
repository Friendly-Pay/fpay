import { Header } from './Header';
import { getCurrentRoute, Routes } from '@/routes';
import { useTransactionStore } from '@/store/transaction';
import { selectIsTransactionFailed, selectIsTransactionSuccess } from '@/store/transaction/selectors';
import { PropsWithChildren } from 'react';
import styles from './PageLayout.module.scss';

export const PageLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const isTransactionSuccess = useTransactionStore(selectIsTransactionSuccess);
    const isTransactionFailed = useTransactionStore(selectIsTransactionFailed);

    const renderHeader = () => {
        const route = getCurrentRoute(window.location.pathname)?.route;
        if (route === Routes.SBP_PAYMENT || route === Routes.CARD_PAYMENT) {
            if (isTransactionSuccess || isTransactionFailed) {
                return null;
            }
        }

        return (
            <>
                <div className={styles.fakeHeader}></div>
                <Header />
            </>
        );
    };

    return (
        <div className={styles.root}>
            <div className={styles.rootContent}>
                {renderHeader()}
                {children}
            </div>
        </div>
    );
};
