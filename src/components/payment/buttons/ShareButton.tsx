import { PayButton } from './PayButton';
import { CircleIcon } from '@/components/ui/icon/CircleIcon';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

interface ShareButtonProps {
    onClick?: () => void
    className?: string
};

export const ShareButton: React.FC<ShareButtonProps> = ({ className, onClick }) => {
    const [t] = useTranslation();
    return (
        <PayButton
            title={t('Share<br/>link')}
            className={cn(className)}
            onClick={onClick}
        >
            <CircleIcon
                width={38}
                height={38}
                svgWidth={18}
                svgHeight={18}
                background='var(--color-background-neutral-2)'
            >
                <Arrow />
            </CircleIcon>
        </PayButton>
    );
};

const Arrow = () => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M7.26671 6.61648V18H10.7236V6.61648L14.6869 10.5798L17.1309 8.13578L8.99515 0L0.859375 8.13578L3.30339 10.5798L7.26671 6.61648Z"
                fill="url(#paint0_linear_7894_20765)"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_7894_20765"
                    x1="4.18357"
                    y1="4.16159"
                    x2="13.8607"
                    y2="13.7842"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop
                        stopColor="white"
                        stopOpacity="0.6"
                    />
                    <stop
                        offset="1"
                        stopColor="white"
                        stopOpacity="0.3"
                    />
                </linearGradient>
            </defs>
        </svg>
    );
};