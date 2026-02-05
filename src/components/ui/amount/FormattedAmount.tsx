import { toMinorUnits } from '@/utils/math';
import { formatAmount } from '@friendly-pay/utils';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './FormattedAmount.module.scss';

type FormattedAmountProps = {
    /** Значение */
    value: number | null

    /** Вид суммы */
    view?: 'default' | 'withMinor'

    /** Валюта */
    currency?: string

    /** Максимальное число знаков до запятой */
    minority?: number

    /** Знак позитивной суммы */
    positiveSymbol?: 'plus',

    /** Классы css */
    className?: string
    majorPartClassName?: string;
    minorPartClassName?: string;
    currencyClassName?: string;
    currencySeparatorClassName?: string;
    positiveSymbolClassName?: string;
}

export function FormattedAmount({
    value,
    view,
    currency,
    minority,
    positiveSymbol,
    className,
    majorPartClassName,
    minorPartClassName,
    currencyClassName,
    currencySeparatorClassName,
    positiveSymbolClassName,
}: FormattedAmountProps) {
    const { i18n } = useTranslation();

    const currencyMinority = minority || 0;

    const formatted = useMemo(() => {
        return formatAmount({
            value: value ? toMinorUnits(value, currencyMinority) : 0,
            currency,
            minority: currencyMinority,
            view: view || 'default',
            locale: i18n.language,
        });
    }, [value, view, currency, currencyMinority, i18n.language]);

    return (
        <div className={classNames(styles.amount, className)}>
            {positiveSymbol === 'plus' && <span className={classNames(styles.positiveSymbol, positiveSymbolClassName)}>+</span>}

            {/* Валюта перед числом (для префиксного формата) */}
            {formatted.currencyPosition === 'prefix' && formatted.currencySymbol && (
                <>
                    <span className={classNames(styles.currency, currencyClassName)}>{formatted.currencySymbol}</span>
                    {formatted.currencySeparator && (
                        <span className={classNames(styles.currencySeparator, currencySeparatorClassName)}>
                            {formatted.currencySeparator}
                        </span>
                    )}
                </>
            )}

            {/* Целая часть числа с разделителями тысяч */}
            <span className={classNames(styles.majorPart, majorPartClassName)}>
                {formatted.majorPart}
            </span>

            {/* Дробная часть (если есть) */}
            {formatted.minorPart && (
                <span className={classNames(styles.mimorPart, minorPartClassName)}>
                    {formatted.decimalsSeparator}
                    {formatted.minorPart}
                </span>
            )}

            {/* Валюта после числа (для суффиксного формата) */}
            {formatted.currencyPosition === 'suffix' && formatted.currencySymbol && (
                <>
                    {formatted.currencySeparator && (
                        <span className={classNames(styles.currencySeparator, currencySeparatorClassName)}>
                            {formatted.currencySeparator}
                        </span>
                    )}
                    <span className={classNames(styles.currency, currencyClassName)}>{formatted.currencySymbol}</span>
                </>
            )}
        </div>
    );
}