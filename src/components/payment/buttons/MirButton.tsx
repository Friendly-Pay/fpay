import { MirLogo } from '@/components/ui/icon/MirLogo';
import cn from 'classnames';
import styles from './MirButton.module.scss';

interface MirButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

export const MirButton: React.FC<MirButtonProps> = ({ className, disabled, onClick }) => {
    return (
        <button
            type="button"
            className={cn(styles.button, className)}
            disabled={disabled}
            onClick={onClick}
        >
            <MirLogo className={styles.logo} />
        </button>
    );
};
