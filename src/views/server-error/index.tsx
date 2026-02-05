import { Button } from '@friendly-pay/uikit/Button';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

const ServerErrorView: React.FC = () => {
    const [t] = useTranslation();

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className={styles.root} >
            <div className={styles.status}>
                <span>500</span>
            </div>

            <h4 className={styles.title}>
                {t('Something went wrong')}
            </h4>

            <div className={styles.text}>
                {t('Connection lost. Try again')}
            </div>

            <Button
                view='primary'
                size='52'
                className={styles.button}
                onClick={handleRetry}
            >
                {t('Try again')}
            </Button>
        </div>
    );
};

export default ServerErrorView;