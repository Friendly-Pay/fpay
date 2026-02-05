import './polyfills';
import { AppRoutes } from './AppRoutes';
import { Toasts } from './components/ui/toast/ToastsRoot';
import { initLocalization } from './localization';
import { getCurrentRoute, Routes } from './routes';
import { useShopStore } from './store/shop';
import { useTransactionStore } from './store/transaction';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';

const runApp = async () => {
    // 1. Загрузка основных данных по маршуруту
    const initialPath = getCurrentRoute(window.location.pathname);
    const initialSkeleton = document.getElementById('initial-skeleton');

    switch (initialPath?.route) {
        case Routes.CREATE_PAYMENT:
            await useShopStore.getState().loadShop(initialPath.publicShopId);
            break;

        case Routes.SBP_PAYMENT:
            await useTransactionStore.getState().loadOrder(initialPath.transactionId);
            break;
    }

    const initialLanguage = useShopStore.getState().language;
    await initLocalization(initialLanguage);

    // 2. Рендер приложения уже с данными
    // 3. Скрыть скелетоны
    // 4. Какая-то доп логика (если нужна) например добавить класс и тд

    // Когда админка
    // 1. Загрузить данные по роли пользователя
    // 2. Отправляем на конроллер-роут который определит маршрут
    // 3. Рендер финальной страницы
    // 4. Или можно еще проще, не меняя url просто рендерить в одном виде в зависимости от того какая роль

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <Toasts />
            <AppRoutes />
        </React.StrictMode>
    );

    if (initialSkeleton) {
        initialSkeleton.style.display = 'none';
    }
};

runApp();