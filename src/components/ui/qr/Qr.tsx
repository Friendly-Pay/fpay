import sbpIcon from 'assets/sbp/sbp-qr-logo.png';
import QRCodeStyling, { ErrorCorrectionLevel } from 'qr-code-styling-new';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import styles from './Qr.module.scss';

interface Props {
    code: string;
    isSbp: boolean;
}

const QR: React.FC<Props> = ({ code, isSbp }) => {
    const SbpParams = useCallback(() => {
        if (isSbp) {
            return {
                image: sbpIcon,
                backgroundOptions: {
                    color: '#1B1B1D',
                },
                qrOptions: {
                    errorCorrectionLevel: 'Q' as ErrorCorrectionLevel,
                },
                imageOptions: {
                    hideBackgroundDots: true,
                    imageSize: 0.4,
                    margin: 0,
                },
            };
        }

        return {};
    }, [isSbp]);

    const ref = useRef<HTMLInputElement | null>(null);
    const qrCode = useMemo(
        () =>
            new QRCodeStyling({
                width: 600,
                height: 600,
                margin: 0,
                qrOptions: {
                    typeNumber: 0,
                    mode: 'Byte',
                    errorCorrectionLevel: 'L',
                },
                imageOptions: {
                    hideBackgroundDots: true,
                    imageSize: 0.4,
                    margin: 0,
                },
                dotsOptions: {
                    type: 'extra-rounded',
                    color: '#FFFFFF',
                },
                cornersSquareOptions: {
                    type: 'extra-rounded',
                    color: '#FFFFFF',
                },
                backgroundOptions: {
                    color: 'transparent',
                },
                ...SbpParams(),
            }),
        [],
    );

    useEffect(() => {
        qrCode.update({
            data: code,
        });
    }, [code]);

    useEffect(() => {
        qrCode.append(ref.current as HTMLElement);
    }, []);

    return <div
        ref={ref}
        className={styles.container}
    />;
};

export default QR;
