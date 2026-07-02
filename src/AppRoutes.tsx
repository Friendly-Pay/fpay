import { PageLayout } from './components/layout/PageLayout';
import { Routes as ROUTES } from './routes';
import { CreatePaymentView } from './views/create-payment';
import NotFoundView from './views/not-found';
import PaymentView from './views/payment';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export const AppRoutes: React.FC = () => {
    return (
        <PageLayout>
            <BrowserRouter>
                <Routes>
                    <Route
                        path={ROUTES.CREATE_PAYMENT}
                        element={<CreatePaymentView />}
                    />
                    <Route
                        path={ROUTES.SBP_PAYMENT}
                        element={<PaymentView />}
                    />
                    <Route
                        path={ROUTES.CARD_PAYMENT}
                        element={<PaymentView />}
                    />
                    <Route
                        path="*"
                        element={<NotFoundView />}
                    />
                </Routes>
            </BrowserRouter>
        </PageLayout>
    );
};
