
import { maskUtils } from '../maskUtils';
import { DEFAULT_PHONE_FORMAT } from './consts';
import { type CountriesData, countriesData } from './country-data';
import { type AreaItem, type Country } from './types';
import { type MaskitoOptions, type MaskitoPlugin } from '@maskito/core';
import { type MutableRefObject } from 'react';

export function initCountries(iso2s?: string[], customCountriesList?: CountriesData[]) {
    const data = customCountriesList ?? countriesData;
    const filteredCountriesData = Array.isArray(iso2s)
        ? data.filter((country) => iso2s.includes(country[2]))
        : data;

    return filteredCountriesData.map((country) => {
        const countryItem: Country = {
            name: country[0],
            regions: country[1],
            iso2: country[2],
            countryCode: country[3],
            dialCode: country[3],
            format: country[4],
            priority: country[5] || 0,
        };

        const areaItems: AreaItem[] = [];

        if (country[6]) {
            country[6]?.forEach((areaCode) => {
                const areaItem: AreaItem = {
                    ...countryItem,
                    dialCode: country[3] + areaCode,
                    isAreaCode: true,
                    areaCodeLength: areaCode.length,
                };

                areaItems.push(areaItem);
            });
        }

        if (areaItems.length > 0) {
            countryItem.mainCode = true;

            return [countryItem, ...areaItems];
        }

        return [countryItem];
    });
}

export function findCountry(
    countries: Country[][],
    value: string | undefined,
    iso2: string | undefined,
    country?: Country,
) {
    if (country) return country;

    if (value) {
        const inputNumber = clearMask(value);
        const nextCountry = guessCountry(inputNumber, countries);

        return nextCountry;
    }

    if (!iso2) return undefined;

    return countries.find((c) => c[0].iso2 === iso2)?.[0];
}

export function guessCountry(inputNumber: string, data: Country[][]) {
    const inputNumberDialCode = inputNumber.slice(0, 6);
    const result = data.reduce(
        (selectedCountry, countryData) => {
            let guess;

            countryData.forEach((country) => {
                if (inputNumberDialCode.startsWith(country.dialCode)) {
                    const selectedCountryDialCode = selectedCountry?.dialCode || '';
                    const selectedCountryPriority = selectedCountry?.priority || 100;

                    if (country.dialCode.length > selectedCountryDialCode.length) {
                        guess = country;
                    }

                    if (
                        country.dialCode.length === selectedCountryDialCode.length &&
                        country.priority < selectedCountryPriority
                    ) {
                        guess = country;
                    }
                }
            });

            return guess || selectedCountry;
        },
        undefined as Country | undefined,
    );

    if (!result && inputNumber.startsWith('8')) {
        const matchContry = data.some(([{ dialCode }]) => dialCode.startsWith(inputNumberDialCode));

        if (!matchContry) {
            return data.find(([{ iso2 }]) => iso2 === 'ru')?.[0];
        }
    }

    return result;
}

export function clearMask(value: string) {
    return value.replace(/\D/g, '');
}

function itemToMask(item: string) {
    return item === '.' ? /\d/ : item;
}

function prepareDefaultFormat(countryCode?: string, clearableCountryCode?: boolean) {
    if (!countryCode) return ['+', ...DEFAULT_PHONE_FORMAT.split('').map(itemToMask)];

    const removeDots = (count: number) => {
        let removed = 0;
        let res = DEFAULT_PHONE_FORMAT;

        while (removed < count) {
            res = res.replace(/\./, '');
            removed += 1;
        }

        return res.trim();
    };

    if (clearableCountryCode) {
        return [
            '+',
            ...countryCode.split('').map(() => /\d/),
            ' ',
            ...removeDots(countryCode.length).split('').map(itemToMask).reverse(),
        ];
    }

    return [
        '+',
        ...countryCode.split(''),
        ' ',
        ...removeDots(countryCode.length).split('').map(itemToMask).reverse(),
    ];
}

export function createPhoneMaskExpression(
    country: Country | undefined,
    clearableCountryCode: boolean,
): Array<RegExp | string> {
    const { countryCode, format } = country || {};

    if (!countryCode || !format) {
        return prepareDefaultFormat(countryCode, clearableCountryCode);
    }

    return [
        '+',
        ...(clearableCountryCode ? countryCode.split('').map(() => /\d/) : countryCode.split('')),
        ' ',
        ...format.split('').map(itemToMask),
    ];
}

export function createMaskOptions(
    country: Country | undefined,
    clearableCountryCode: boolean,
    preserveCountryCode: boolean,
    beforeAutofillValueRef: MutableRefObject<string>,
): MaskitoOptions {
    const countryCode = country?.countryCode;
    const prefix = countryCode ? getInitialValueFromCountry(countryCode) : '';
    const prefixLen = !clearableCountryCode && prefix ? prefix.length : 0;
    const mask = createPhoneMaskExpression(country, clearableCountryCode);

    const plugins = [
        maskUtils.caretGuard((value, [from, to]) => [from === to ? prefixLen : 0, value.length]),
    ];

    if (preserveCountryCode) {
        plugins.push(createMaskitoAutofillPlugin(beforeAutofillValueRef));
    }

    return {
        mask,
        preprocessors: [
            maskUtils.insertionPhonePreprocessor(mask, countryCode, clearableCountryCode),
        ],
        postprocessors: [maskUtils.prefixPostprocessor(prefixLen > 0 ? prefix : '')],
        plugins,
    };
}

function createMaskitoAutofillPlugin(
    beforeAutofillValueRef: MutableRefObject<string>,
): MaskitoPlugin {
    return (element) => {
        let { value } = element;

        const handleInput = () => {
            if (element.value.indexOf('+') === -1 && /^\+\d+/.test(value)) {

                beforeAutofillValueRef.current = value;
            }

            value = element.value;
        };

        const handleBlur = () => {
            if (element.matches(':autofill') || element.matches(':-webkit-autofill')) {
                // '+7 999 999 99 99' -> ['+7']
                const match = beforeAutofillValueRef.current.match(/^\+\d+/);

                if (match) {
                    const [p] = match;

                    if (!value.startsWith(p)) {
                        maskitoUpdateElement(element as any, p + value);
                    }
                }
            }
        };

        element.addEventListener('input', handleInput);
        element.addEventListener('blur', handleBlur);

        return () => {
            element.removeEventListener('input', handleInput);
            element.removeEventListener('blur', handleBlur);
        };
    };
}

export function getPhoneData(phone: string, countries: Country[][], defaultIso2?: string) {
    let nextPhone = phone;
    const inputNumber = clearMask(nextPhone);
    const nextCountry = findCountry(countries, phone, defaultIso2);

    if (nextCountry?.iso2 === 'ru' && inputNumber.startsWith('8')) {
        nextPhone = phone.replace(/\+?8/, '+7');
    }

    return {
        nextPhone,
        nextCountry,
    };
}

export function getClear(
    clear?: boolean,
    clearableCountryCode?: boolean,
    value = '',
    countryCode = '',
) {
    if (!clear) return false;

    const trimmedValue = value.trim();

    return clearableCountryCode
        ? trimmedValue !== '' && trimmedValue !== '+'
        : trimmedValue.length > countryCode.length + 1;
}

export function getInitialValueFromCountry(countryCode: string) {
    return `+${countryCode}`;
}

/**
 * @see https://github.com/taiga-family/maskito/issues/804#issuecomment-1862750990
 */
function maskitoUpdateElement(
    element: HTMLInputElement | HTMLTextAreaElement,
    value: string,
): void {
    const initialValue = element.value;


    element.value = value;

    if (element.value !== initialValue) {
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }
}