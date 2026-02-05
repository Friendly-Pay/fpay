import { TransactionPooling } from './TransactionPooling';
import { useTransactionStore } from '@/store/transaction';
import { TransactionStatus } from '@/store/transaction/api';
import { selectIsTransactionActive } from '@/store/transaction/selectors';
import { useCallback, useEffect, useRef } from 'react';

const TIMER_TICK_MS = 1_000;
const POLLING_INTERVAL_MS = parseInt(import.meta.env.VITE_TRANSACTION_POOLING_INTERVAL_MS);
const INACTIVE_WARNING_THRESHOLD_MS = 3 * 60 * 1_000;

export const PaymentController: React.FC = () => {
    const transactionId = useTransactionStore(state => state.transactionId);
    const status = useTransactionStore(state => state.status);
    const expireIn = useTransactionStore(state => state.expireIn);
    const expireInReceivedAt = useTransactionStore(state => state.expireInReceivedAt);
    const isTransactionActive = useTransactionStore(selectIsTransactionActive);

    const timerIntervalId = useRef(0);

    const clearTimerInterval = useCallback(() => {
        if (timerIntervalId.current) {
            window.clearInterval(timerIntervalId.current);
            timerIntervalId.current = 0;
        }
    }, []);

    // Считаем время с учетом смещения локальных часов
    const calculateRemainingTime = () => {
        if (!expireIn || expireIn <= 0 || !expireInReceivedAt) {
            return 0;
        }

        const totalMs = expireIn * 1000;
        const elapsedMs = performance.now() - expireInReceivedAt;
        const timeLeft = totalMs - elapsedMs;

        return timeLeft > 0 ? timeLeft : 0;
    };

    const inactiveWarningHasShowed = useRef(false);

    // Таймер до перехода в статус EXPIRED | SUCCESS | FAILED
    useEffect(() => {
        const { updateInactiveWarning, updateRemainingTimeMs, updateStatus } = useTransactionStore.getState();

        if (!expireIn || expireIn <= 0 || !expireInReceivedAt || !isTransactionActive) {
            clearTimerInterval();
            updateRemainingTimeMs(0);
            updateInactiveWarning(false);
            return;
        }

        const tick = () => {
            const timeLeft = calculateRemainingTime();

            updateRemainingTimeMs(timeLeft);

            // Показываем специальный стейт, если осталось менее 3-х минут
            if (timeLeft > 0 && timeLeft <= INACTIVE_WARNING_THRESHOLD_MS) {
                if (!inactiveWarningHasShowed.current) {
                    updateInactiveWarning(true);
                    inactiveWarningHasShowed.current = true;
                }
            }

            // Время кончилось
            // @TODO лучше свернить с бекендом (на время загрузки тут показать оверлей)
            if (timeLeft <= 0) {
                updateStatus(TransactionStatus.EXPIRED);
                clearTimerInterval();
            }
        };

        tick();
        timerIntervalId.current = window.setInterval(tick, TIMER_TICK_MS);

        return () => {
            clearTimerInterval();
        };
    }, [expireIn, expireInReceivedAt, status]);

    // Pooling статуса транзакции
    useEffect(() => {
        if (!POLLING_INTERVAL_MS) {
            return;
        }

        const pooling = new TransactionPooling(
            async () => {
                try {
                    await useTransactionStore.getState().loadOrder(transactionId);
                } catch { }
            },
            POLLING_INTERVAL_MS
        );

        if (!transactionId || !isTransactionActive || !POLLING_INTERVAL_MS) {
            pooling.stop();
            return;
        }

        pooling.start();
        return () => {
            pooling?.stop();
        };
    }, [transactionId, status]);

    return null;
};