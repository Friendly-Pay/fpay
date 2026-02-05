import { Spinner } from '../Spinner';
import React, { ButtonHTMLAttributes, PropsWithChildren, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';

type ButtonProps = {
    /* Вид кнопки */
    view?: 'primary' | 'secondary' | 'secondaryColored' | 'white' | 'transparent';

    /** Тип кнопки */
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type']

    /**
     * Размер кнопки
     */
    size?: '42' | '52' | '56' | '58'

    loading?: boolean;
    disabled?: boolean;

    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const sizeClassnamesMap: { [size: string]: string } = {
    '42': styles.small,
    '52': styles.medium,
    '56': styles.normal,
    '58': styles.big
};

export const LOADER_MIN_DISPLAY_INTERVAL = 600;

// @TODO вынести в friendly-lab/button
export const Button = React.forwardRef<
    HTMLButtonElement,
    PropsWithChildren<ButtonProps>
>(
    (
        {
            view = 'primary',
            type = 'button',
            size = '56',
            loading,
            disabled,
            className,
            children,
            onClick
        },
        ref,
    ) => {
        const [loaderTimePassed, setLoaderTimePassed] = useState(true);

        const timerId = useRef(0);
        const showLoader = loading && !disabled || !loaderTimePassed;

        const buttonClassnames = classNames(
            styles.button,
            styles[view],
            sizeClassnamesMap[size],
            loading && styles.loading,
            disabled && styles.disabled,
            className
        );

        useEffect(() => {
            if (loading) {
                setLoaderTimePassed(false);

                timerId.current = window.setTimeout(() => {
                    setLoaderTimePassed(true);
                }, LOADER_MIN_DISPLAY_INTERVAL);
            }
        }, [loading]);

        useEffect(
            () => () => {
                window.clearTimeout(timerId.current);
            },
            [],
        );

        const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (disabled || showLoader) {
                e.preventDefault();
                e.stopPropagation();

                return;
            }
            onClick?.(e);
        };

        return (
            <button
                ref={ref}
                type={type}
                className={buttonClassnames}
                disabled={disabled || showLoader}
                onClick={handleClick}
            >
                {loading ? (
                    <div className={styles.loader}>
                        {<Spinner />}
                    </div>
                ) : (
                    children
                )}
            </button>
        );
    }
);