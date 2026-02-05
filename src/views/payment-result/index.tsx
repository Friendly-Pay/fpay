import { FormattedAmount } from '@/components/ui/amount/FormattedAmount';
import { CURRENCY } from '@friendly-pay/currency';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

interface ResultViewProps {
    state: 'SUCCESS' | 'FAILED'

    /** Сумма, которую мерчант ввёл (THB) */
    orderAmount: number;
    orderAmountCurrency: string;

    /** 
     * Сумма, которую пользователь реально платит:
     * сейчас — RUB, далее появится крипта 
     */
    paymentAmount: number;
    paymentAmountCurrency: string;
};

const PaymentResultView: React.FC<ResultViewProps> = ({ state, orderAmount, orderAmountCurrency, paymentAmount, paymentAmountCurrency }) => {
    const [t] = useTranslation();

    const orderCurrency = CURRENCY[orderAmountCurrency as keyof typeof CURRENCY];
    const paymentCurrency = CURRENCY[paymentAmountCurrency as keyof typeof CURRENCY];

    // Видна ли сумма заказа
    const orderAmountVisible =
        orderCurrency.code !== paymentCurrency.code;

    return (
        <div className={styles.root}>
            <div className={styles.icon}>
                {state === 'SUCCESS'
                    ? (
                        <Success />
                    ) : (
                        <Error />
                    )}
            </div>

            <div className={styles.content}>
                <div className={styles.label}>{t('paid')}</div>
                <div className={styles.paymentAmount}>
                    <FormattedAmount
                        value={paymentAmount}
                        currency={paymentAmountCurrency}
                        minority={paymentCurrency.minorUnits}
                        majorPartClassName={styles.bold}
                    />
                </div>
                {orderAmountVisible && (
                    <div className={styles.orderAmount}>
                        <FormattedAmount
                            value={orderAmount}
                            currency={orderAmountCurrency}
                            minority={orderCurrency.minorUnits}
                            minorPartClassName={styles.regualar}
                            majorPartClassName={styles.regualar}
                            currencyClassName={styles.regualar}
                            currencySeparatorClassName={styles.regualar}
                            positiveSymbolClassName={styles.regular}
                        />
                    </div>)
                }
            </div>
        </div>
    );
};

const Success = () => {
    return (
        <svg
            width="79"
            height="58"
            viewBox="0 0 79 58"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_ii_7760_9483)">
                <path
                    d="M76.2117 2.623C72.7143 -0.874333 67.0419 -0.874333 63.541 2.623L28.668 37.496L15.295 24.123C11.7977 20.6257 6.12526 20.6257 2.62434 24.123C-0.876573 27.6203 -0.87299 33.2928 2.62434 36.7937L19.2689 53.4383C24.4612 58.6305 32.8748 58.6305 38.0671 53.4383L76.2117 15.2937C79.709 11.7927 79.709 6.12033 76.2117 2.623Z"
                    fill="#D3F6B1"
                />
            </g>
            <defs>
                <filter
                    id="filter0_ii_7760_9483"
                    x="0"
                    y="-4"
                    width="78.834"
                    height="65.332"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                >
                    <feFlood
                        flood-opacity="0"
                        result="BackgroundImageFix"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                    />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.709804 0 0 0 0 0.921569 0 0 0 0 0.560784 0 0 0 1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect1_innerShadow_7760_9483"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="-4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                    />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.773691 0 0 0 0 1 0 0 0 0 0.547382 0 0 0 1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="effect1_innerShadow_7760_9483"
                        result="effect2_innerShadow_7760_9483"
                    />
                </filter>
            </defs>
        </svg>
    );
};

const Error = () => {
    return (
        <svg
            width="62"
            height="62"
            viewBox="0 0 62 62"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_ii_7760_9505)">
                <path
                    d="M47.4896 2.48959C50.8091 -0.829863 56.1916 -0.829864 59.5111 2.48959C62.8305 5.80905 62.8305 11.1916 59.5111 14.5111L43.0218 31.0003L59.5111 47.4896C62.8305 50.8091 62.8305 56.1916 59.5111 59.5111C56.1916 62.8305 50.8091 62.8305 47.4896 59.5111L31.0003 43.0218L14.5111 59.5111C11.1916 62.8305 5.80905 62.8305 2.48959 59.5111C-0.829864 56.1916 -0.829863 50.8091 2.48959 47.4896L18.9788 31.0003L2.48959 14.5111C-0.829864 11.1916 -0.829864 5.80905 2.48959 2.48959C5.80905 -0.829864 11.1916 -0.829864 14.5111 2.48959L31.0003 18.9788L47.4896 2.48959Z"
                    fill="#F6B1B2"
                />
            </g>
            <defs>
                <filter
                    id="filter0_ii_7760_9505"
                    x="0"
                    y="-4"
                    width="62"
                    height="70.001"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                >
                    <feFlood
                        flood-opacity="0"
                        result="BackgroundImageFix"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                    />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.921569 0 0 0 0 0.560784 0 0 0 0 0.566797 0 0 0 1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect1_innerShadow_7760_9505"
                    />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="-4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                    />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 0.547382 0 0 0 0 0.554926 0 0 0 1 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="effect1_innerShadow_7760_9505"
                        result="effect2_innerShadow_7760_9505"
                    />
                </filter>
            </defs>
        </svg>
    );
};

export default PaymentResultView;