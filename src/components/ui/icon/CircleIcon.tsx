import { PropsWithChildren } from 'react';
import cn from 'classnames';
import styles from './CircleIcon.module.scss';

export interface CircleIconProps {
    /** Ширина внешнего круга. */
    width: number;

    /** Высота внешнего круга. */
    height: number;

    /** Фоновый цвет круга. */
    background: string;

    /** Дополнительный CSS-класс контейнера. */
    className?: string;

    /** Ширина вложенной SVG-иконки. */
    svgWidth: number;

    /** Высота вложенной SVG-иконки. */
    svgHeight: number;

    /** Дополнительный CSS-класс для SVG. */
    svgClassName?: string;
}

export const CircleIcon: React.FC<PropsWithChildren<CircleIconProps>> = ({
    width,
    height,
    background,
    children,
    className,
    svgWidth,
    svgHeight,
    svgClassName
}) => {
    return (
        <div
            className={cn(styles.icon, className)}
            style={{ width, height }}
        >
            <div
                className={styles.background}
                style={{ background }}
            ></div>
            <div
                className={cn(styles.svg, svgClassName)}
                style={{ width: svgWidth, height: svgHeight }}
            >
                {children}
            </div>
        </div>
    );
};