import { Header } from './Header';
import { getCurrentRoute, Routes } from '@/routes';
import { useTransactionStore } from '@/store/transaction';
import {
    selectIsTransactionFailed,
    selectIsTransactionSuccess
} from '@/store/transaction/selectors';
import { PropsWithChildren } from 'react';
import styles from './PageLayout.module.scss';

export const PageLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const isTransactionSuccess = useTransactionStore(
        selectIsTransactionSuccess
    );
    const isTransactionFailed = useTransactionStore(selectIsTransactionFailed);

    // На экране результата оплаты (успех/неудача) хэдер не показываем
    const isSbpPaymentRoute =
        getCurrentRoute(window.location.pathname)?.route === Routes.SBP_PAYMENT;
    const hideHeader =
        isSbpPaymentRoute && (isTransactionSuccess || isTransactionFailed);

    return (
        <div className={styles.root}>
            <div className={styles.rootContent}>
                {!hideHeader && (
                    <>
                        <div className={styles.fakeHeader}></div>
                        <Header />
                    </>
                )}

                {children}
            </div>
        </div>
    );
};
