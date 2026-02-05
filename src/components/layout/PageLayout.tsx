import { Header } from './Header';
import { PropsWithChildren } from 'react';
import styles from './PageLayout.module.scss';

export const PageLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className={styles.root}>
            <div className={styles.rootContent}>
                <div className={styles.fakeHeader}></div>
                <Header />

                {children}
            </div>
        </div>
    );
};