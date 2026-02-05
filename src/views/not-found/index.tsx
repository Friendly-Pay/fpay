import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

interface NotFoundViewProps {
    /**
     * Если 404 произошёл из-за отсутствия транзакции
     * */
    transactionNotFound?: boolean;

    /**
     * 404 произошла из-за отсутствия мерчанта
     */
    shopNotFound?: boolean;
}

const NotFoundView: React.FC<NotFoundViewProps> = ({ transactionNotFound, shopNotFound }) => {
    const [t] = useTranslation();

    let message: string | null = null;

    if (transactionNotFound) {
        message = t('Check the link or contact the store');
    } else if (shopNotFound) {
        message = t('Check the link or contact support');
    }

    return (
        <div className={styles.root}>
            <div className={styles.status}>
                <span>404</span>
            </div>

            <h4 className={styles.title}>
                {t('This page doesn’t exist')}
            </h4>
            {message && (
                <div className={styles.text}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default NotFoundView;