import { PayButton } from './PayButton';
import QR from '@/components/ui/qr/Qr';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

interface QrButtonProps {
    nspkUrl: string
    onClick?: () => void
    className?: string
};

export const QrButton: React.FC<QrButtonProps> = ({ nspkUrl, className, onClick }) => {
    const [t] = useTranslation();
    return (
        <PayButton
            title={t('Scan<br/>QR code')}
            className={cn(className)}
            onClick={onClick}
        >
            <QR
                code={nspkUrl}
                isSbp
            />
        </PayButton>
    );
};