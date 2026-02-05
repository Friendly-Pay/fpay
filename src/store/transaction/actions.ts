import { useTransactionStore } from '.';
import { ClientEnvironment } from '@/lib/client-environment';
import { copyToClipboard } from '@/lib/copy-to-clipboard';
import { toast } from 'sonner';

export class TransactionActions {
    static client = new ClientEnvironment();

    static openNspk() {
        const url = useTransactionStore.getState().qrLink;
        if (url) {
            window.location.href = url;
        }
    }

    static async sharePaymentLink() {
        const orderId = useTransactionStore.getState().orderId;
        if (!orderId) {
            return;
        }

        const shareUrl = window.location.href;

        if (TransactionActions.client.isMobile()) {
            const shareData: ShareData = {
                title: 'Friendly Pay | Платежная страница',
                text: `Оплата заказа ${orderId}`,
                url: shareUrl,
            };

            if ('share' in navigator) {
                try {
                    await navigator.share(shareData);
                    return true;
                } catch {
                    return false;
                }
            }
        }

        copyToClipboard(shareUrl);
        toast.success('Ссылка скопирована');
    }
}