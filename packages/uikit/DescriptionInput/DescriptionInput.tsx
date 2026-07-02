import { Input, InputProps } from '../Input/Input';
import { forwardRef } from 'react';
import cn from 'classnames';
import styles from './DescriptionInput.module.scss';

export type DescriptionInputProps = Omit<InputProps, 'type'>;

export const DescriptionInput = forwardRef<HTMLInputElement, DescriptionInputProps>(
    (
        {
            fieldClassName,
            autoComplete = 'off',
            autoCorrect = 'off',
            autoCapitalize = 'off',
            ...restProps
        },
        ref,
    ) => {
        return (
            <Input
                {...restProps}
                ref={ref}
                type='text'
                autoComplete={autoComplete}
                autoCorrect={autoCorrect}
                autoCapitalize={autoCapitalize}
                fieldClassName={cn(styles.field, fieldClassName)}
            />
        );
    },
);

DescriptionInput.displayName = 'DescriptionInput';
