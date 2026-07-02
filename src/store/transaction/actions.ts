import { useTransactionStore } from '.';
import { ClientEnvironment } from '@/lib/client-environment';
import { copyToClipboard } from '@/lib/copy-to-clipboard';
import { toast } from 'sonner';

export class TransactionActions {
    static client = new ClientEnvironment();

    static openNspk() {
        TransactionActions.navigateExternal(useTransactionStore.getState().qrLink);
    }

    static openBankPage() {
        TransactionActions.navigateExternal(useTransactionStore.getState().formLink);
    }

    private static navigateExternal(link: string | null) {
        if (!link) {
            return;
        }

        let url: URL;
        try {
            url = new URL(link);
        } catch {
            return;
        }

        if (url.protocol !== 'https:') {
            return;
        }

        window.location.assign(url.href);
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
                url: shareUrl
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
