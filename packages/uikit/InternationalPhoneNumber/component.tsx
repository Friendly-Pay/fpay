import { Input, InputProps } from '../Input/Input';
import { type Country, type InternationalPhoneInputProps } from './types';
import {
    createMaskOptions,
    findCountry,
    getClear,
    getInitialValueFromCountry,
    getPhoneData,
    initCountries,
} from './utils';
import { maskitoTransform } from '@maskito/core';
import { useMaskito } from '@maskito/react';
import {
    type ChangeEvent,
    forwardRef,
    // type MouseEvent,
    type RefAttributes,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { mergeRefs } from 'react-merge-refs';
import styles from './index.module.scss';

export const InternationalPhoneInput = forwardRef<
    HTMLInputElement,
    InternationalPhoneInputProps
>(
    (
        {
            clearableCountryCode: clearableCountryCodeFromProps = true,
            value,
            country: countryProp,
            // filterFn,
            onChange,
            onCountryChange,
            // countrySelectProps,
            countries,
            defaultIso2,
            disabled,
            // options,
            // size = 56,
            // Input,
            // InputAutocomplete,
            // SelectComponent,
            // view,
            clear: clearProp,
            // open: openProps,
            // defaultOpen,
            customCountriesList,
            ...restProps
        },
        ref,
    ) => {
        const countriesData = useMemo(
            () => initCountries(countries, customCountriesList),
            [countries, customCountriesList],
        );
        const inputRef = useRef<HTMLInputElement>(null);
        const inputWrapperRef = useRef<HTMLDivElement>(null);

        const beforeAutofillValueRef = useRef('');
        const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(() =>
            findCountry(countriesData, value, defaultIso2, countryProp),
        );

        const country = countryProp ?? selectedCountry;

        const handleCountryChange = (nextCountry?: Country) => {
            if (countryProp === undefined) setSelectedCountry(nextCountry);
            onCountryChange?.(nextCountry);
        };

        const preserveCountryCode = clearableCountryCodeFromProps === 'preserve';
        const clearableCountryCode = preserveCountryCode || clearableCountryCodeFromProps;
        const maskOptions = useMemo(
            () =>
                createMaskOptions(
                    country,
                    clearableCountryCode,
                    preserveCountryCode,
                    beforeAutofillValueRef,
                ),
            [country, clearableCountryCode, preserveCountryCode],
        );

        const maskRef = useMaskito({ options: maskOptions });

        const changeNumber = (phone: string) => {
            onChange?.(phone);
        };

        const updatePhoneData = (phone: string) => {
            const { nextCountry, nextPhone } = getPhoneData(phone, countriesData, defaultIso2);

            if (nextCountry !== country) {
                handleCountryChange?.(nextCountry);
            }
            changeNumber(nextPhone);
        };

        const handleInput = ({ target: { value: inputValue } }: ChangeEvent<HTMLInputElement>) => {
            updatePhoneData(inputValue);
        };
        // event: MouseEvent<HTMLButtonElement>
        const handleClear = () => {
            // restProps.inputProps?.onClear?.(event);

            if (clearableCountryCode) {
                const nextCountry = findCountry(countriesData, '', defaultIso2, countryProp);

                changeNumber('');
                handleCountryChange(nextCountry);
            } else {
                changeNumber(country ? getInitialValueFromCountry(country.countryCode) : '');
            }
        };

        useEffect(() => {
            if (value) {
                const newValue = maskitoTransform(value, maskOptions);

                if (value !== newValue) {
                    updatePhoneData(newValue);
                }
            }
        }, [value, maskOptions]);

        const inputProps: InputProps & RefAttributes<HTMLInputElement> = {
            className: styles.component,
            ref: mergeRefs([maskRef, ref, inputRef]),
            wrapperRef: inputWrapperRef,
            addonsClassName: styles.addons,
            type: 'tel',
            autoComplete: 'tel',
            clear: getClear(clearProp, clearableCountryCode, value, country?.countryCode),
            // ...restProps.inputProps,
        };

        return (
            <Input
                {...restProps}
                {...inputProps}
                onClear={inputProps.clear ? handleClear : undefined}
                onInput={handleInput}
                value={value}
                disabled={disabled}
            />
        );
    },
);