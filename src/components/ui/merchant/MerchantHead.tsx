import { buildRoute } from '@/routes';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import styles from './MerchantHead.module.scss';

interface MerchantHeadProps {
    name: string
    publicShopId: string
    shopId: number
    /**
     * Цвет плашки
     */
    background: string
    className?: string
};

export const MerchantHead: React.FC<MerchantHeadProps> = ({ name, shopId, background, className }) => {
    const [t] = useTranslation();
    return (
        <a
            href={buildRoute.merchantShop(shopId)}
            rel='nofollow'
            target='_blank'
            className={cn(styles.merchant, className)}
            style={{ background }}
        >
            <div className={styles.content}>
                <div className={styles.name}>{name}</div>
                <div className={styles.merchantNum}>{t('Merchant #')}{shopId}</div>
            </div>

            <div className={styles.more}>
                <More />
            </div>
        </a>
    );
};

const More = () => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 6.75C12.9665 6.75 13.75 5.9665 13.75 5C13.75 4.0335 12.9665 3.25 12 3.25C11.0335 3.25 10.25 4.0335 10.25 5C10.25 5.9665 11.0335 6.75 12 6.75ZM13.75 12C13.75 12.9665 12.9665 13.75 12 13.75C11.0335 13.75 10.25 12.9665 10.25 12C10.25 11.0335 11.0335 10.25 12 10.25C12.9665 10.25 13.75 11.0335 13.75 12ZM13.75 19C13.75 19.9665 12.9665 20.75 12 20.75C11.0335 20.75 10.25 19.9665 10.25 19C10.25 18.0335 11.0335 17.25 12 17.25C12.9665 17.25 13.75 18.0335 13.75 19Z"
                fill="currentColor"
            />
        </svg>
    );
};