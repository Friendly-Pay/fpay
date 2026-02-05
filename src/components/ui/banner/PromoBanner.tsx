import rubleAtTheResort from 'assets/ruble-at-the-resort.png';
import { AnchorHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import styles from './PromoBanner.module.scss';

interface RubleAtTheResortProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    className?: string;
}

export const RubleAtTheResort: React.FC<RubleAtTheResortProps> = ({
    href,
    className,
    rel = 'noreferrer',
    ...restLinkProps
}) => {
    const [t] = useTranslation();

    return (
        <a
            href={href}
            className={cn(styles.banner, className)}
            rel={rel}
            {...restLinkProps}
        >
            <div className={styles.content}>
                <div className={styles.title}>
                    <span
                        className={styles.titleText}
                        dangerouslySetInnerHTML={{ __html: t('Explore our<br/> payment solutions') }}
                    />
                </div>

                <div className={styles.text}>
                    {t('Learn more')}
                </div>
            </div>

            <img
                alt='lazy'
                src={rubleAtTheResort}
                loading='lazy'
                className={styles.image}
                style={{ width: 'auto', inset: 'auto 0px 0px auto' }}
            ></img>
        </a>
    );
};