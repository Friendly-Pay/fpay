export const copyToClipboard = async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Clipboard API error:', error);
        }
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-99999px';
    document.body.prepend(textArea);
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        textArea.remove();
        return successful;
    } catch (error) {
        console.error('execCommand copy error:', error);
        textArea.remove();
        return false;
    }
};