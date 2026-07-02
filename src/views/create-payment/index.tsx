import NotFoundView from '../not-found';
import { PageContent } from '@/components/layout/PageContent';
import { CurrencyButton } from '@/components/ui/currency-button';
import { MerchantHead } from '@/components/ui/merchant/MerchantHead';
import { PaymentRate } from '@/components/ui/rate/PaymentRate';
import { buildRoute } from '@/routes';
import { useShopStore } from '@/store/shop';
import { selectShop, selectShopCurrency, selectShopError, selectShopTransactionTypes } from '@/store/shop/selectors';
import { TransactionType } from '@/store/transaction/api';
import { useTransactionCreateStore } from '@/store/transaction-create';
import { CreateTransactionErrorCode } from '@/store/transaction-create/api';
import { selectTransactionCreateServerError } from '@/store/transaction-create/selectors';
import { fromMinorUnits, toMinorUnits } from '@/utils/math';
import { AmountInput } from '@friendly-pay/uikit/AmountInput/AmountInput';
import { Button } from '@friendly-pay/uikit/Button';
import { DescriptionInput } from '@friendly-pay/uikit/DescriptionInput/DescriptionInput';
import { formatAmount } from '@friendly-pay/utils';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import styles from './styles.module.scss';

export const CreatePaymentView: React.FC = () => {
    const { t, i18n } = useTranslation();
    const shop = useShopStore(selectShop);
    const shopCurrency = useShopStore(selectShopCurrency);
    const transactionTypes = useShopStore(selectShopTransactionTypes);
    const shopError = useShopStore(selectShopError);

    const loading = useTransactionCreateStore(state => state.loading);
    const minLimit = useTransactionCreateStore(state => state.minLimit);
    const maxLimit = useTransactionCreateStore(state => state.maxLimit);
    const serverError = useTransactionCreateStore(selectTransactionCreateServerError);

    const [method, setMethod] = useState<TransactionType>(() => transactionTypes[0] ?? TransactionType.SBP);
    const [amountMinor, setAmountMinor] = useState<number | null>(null);
    const [amountError, setAmountError] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    // @TODO добавить поддержку курса для карт
    const showRate = method === TransactionType.SBP && shopCurrency.mnemonicCode !== 'RUB';

    useEffect(() => {
        if (!serverError) {
            setAmountError('');
            setDescriptionError('');
            return;
        }

        switch (serverError) {
            case CreateTransactionErrorCode.LIMIT_MIN_AMOUNT:
                if (minLimit) {
                    const amount = formatAmount({
                        value: toMinorUnits(minLimit || 0, shopCurrency.minorUnits),
                        currency: shopCurrency.mnemonicCode,
                        codeFormat: 'code',
                        minority: shopCurrency.minorUnits,
                        locale: i18n.language
                    }).formattedWithCurrency;

                    setAmountError(t('Minimum payment is {{amount}}', { amount }));
                }
                break;

            case CreateTransactionErrorCode.LIMIT_MAX_AMOUNT:
                if (maxLimit) {
                    const amount = formatAmount({
                        value: toMinorUnits(maxLimit || 0, shopCurrency.minorUnits),
                        currency: shopCurrency.mnemonicCode,
                        codeFormat: 'code',
                        minority: shopCurrency.minorUnits,
                        locale: i18n.language
                    }).formattedWithCurrency;

                    setAmountError(t('Maximum payment is {{amount}}', { amount }));
                }
                break;

            case CreateTransactionErrorCode.DESCRIPTION_REQUIRED:
                setDescriptionError(t('Enter payment description'));
                break;

            default:
                alert(t('Payment creation unsuccessful'));
        }
    }, [serverError, minLimit, maxLimit, shopCurrency]);

    const handleAmountChange = (
        _e: ChangeEvent<HTMLInputElement> | null,
        payload: {
            value: number | null;
            valueString: string;
        }
    ) => {
        setAmountMinor(payload.value ?? null);
        if (amountError) {
            setAmountError('');
        }
    };

    const handleDescriptionChange = (_e: ChangeEvent<HTMLInputElement>, payload: { value: string }) => {
        setDescription(payload.value);
        if (descriptionError) {
            setDescriptionError('');
        }
    };

    const handleCreatePayment = async () => {
        setAmountError('');

        if (!amountMinor) {
            setAmountError(t('Enter payment amount'));
            return;
        }

        const orderAmount = fromMinorUnits(amountMinor, shopCurrency.minorUnits);
        const order = await useTransactionCreateStore
            .getState()
            .createTransaction(
                method,
                shop.publicShopId,
                orderAmount,
                shopCurrency.mnemonicCode,
                description.trim() || undefined
            );

        if (order) {
            const route =
                method === TransactionType.CARD
                    ? buildRoute.cardPayment(order.transactionId)
                    : buildRoute.sbpPayment(order.transactionId);
            window.location.href = `${window.location.origin}${route}`;
        } else {
            useTransactionCreateStore.getState().setLoading(false);
        }
    };

    if (shopError) {
        return <NotFoundView shopNotFound={shopError === 'NOT_FOUND'} />;
    }

    return (
        <PageContent className={styles.content}>
            <MerchantHead
                name={shop.name}
                publicShopId={shop.publicShopId}
                shopId={shop.shopId}
                background="rgba(138,195,87,0.17)"
                className={styles.merchant}
            />

            <div className={styles.content}>
                <div className={styles.title}>{t('Create payment')}</div>

                <div className={styles.paymentForm}>
                    <div className={styles.amount}>
                        {/* @TODO вынести в friendly-lab/amount-input */}
                        <AmountInput
                            value={amountMinor}
                            currency={shopCurrency.mnemonicCode}
                            codeFormat="letter"
                            error={amountError}
                            block
                            onChange={handleAmountChange}
                            className={cn(loading && styles.disabledInput)}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            tabIndex={0}
                        />

                        {showRate && (
                            <PaymentRate
                                shopId={shop.publicShopId}
                                orderAmount={amountMinor ? fromMinorUnits(amountMinor, shopCurrency.minorUnits) : 0}
                                orderCurrency={shopCurrency.mnemonicCode}
                                className={styles.rate}
                            />
                        )}
                    </div>

                    <div className={styles.currencies}>
                        {transactionTypes.includes(TransactionType.SBP) && (
                            <CurrencyButton.Sbp
                                active={method === TransactionType.SBP}
                                onClick={() => setMethod(TransactionType.SBP)}
                            />
                        )}
                        {transactionTypes.includes(TransactionType.CARD) && (
                            <CurrencyButton.Card
                                active={method === TransactionType.CARD}
                                onClick={() => setMethod(TransactionType.CARD)}
                            />
                        )}
                    </div>

                    <div className={styles.description}>
                        <DescriptionInput
                            value={description}
                            error={descriptionError}
                            placeholder={t('Payment description')}
                            block
                            onChange={handleDescriptionChange}
                        />
                    </div>
                </div>

                <Button
                    size="58"
                    loading={loading}
                    disabled={!transactionTypes.length}
                    onClick={handleCreatePayment}
                >
                    {t('Pay now')}
                </Button>
            </div>
        </PageContent>
    );
};
