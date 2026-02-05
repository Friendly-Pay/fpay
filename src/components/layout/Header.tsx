import { LanguageButton } from '../ui/language/LanguageButton';
import { Routes } from '@/routes';
import logo from 'assets/logo.svg';
import logoSymbol from 'assets/logo-symbol.svg';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
    // const location = useLocation();
    // const redirectedFrom = location?.state?.from as string | undefined;

    // const onLoginRoute = useMatch(Routes.LOGIN);
    // const onSmsVerificationRoute = useMatch(Routes.SMS_VERIFICATION);
    // const onShopDashboard = useMatch(Routes.SHOP_DASHBOARD);

    // const navigate = useNavigate();

    const renderLogo = () => {
        const pathname = window.location.pathname;

        if (pathname === Routes.LOGIN || pathname === Routes.SMS_VERIFICATION) {
            return (
                <div className={styles.logo}>
                    <img
                        src={logoSymbol}
                        style={{ width: '28px', height: '28px' }}
                        className={styles.logoImage}
                    />
                </div>
            );
        }

        // if (onShopDashboard) {
        //     return (
        //         <button
        //             type='button'
        //             className={styles.backButton}
        //         // onClick={() => navigate(redirectedFrom)}
        //         >
        //             <ArrowBack />
        //         </button>
        //     );
        // }

        return (
            <div className={styles.logo}>
                <img
                    src={logo}
                    style={{ width: '159px', height: '28px' }}
                    className={styles.logoImage}
                />
            </div>
        );
    };

    const renderButtons = () => {
        // if (onLoginRoute || onSmsVerificationRoute) {
        //     if (redirectedFrom) {
        //         return (
        //             <a
        //                 href={redirectedFrom}
        //                 className={styles.closeButton}
        //             >
        //                 <Close />
        //             </a>
        //         );
        //     }
        // }

        return (
            <LanguageButton />
        );
    };

    return (
        <header className={styles.header}>
            <div className={styles.content}>
                {renderLogo()}

                <div className={styles.rightButtons}>
                    {renderButtons()}
                </div>
            </div>
        </header>
    );
};

// const Close = () => {
//     return (
//         <svg
//             width="12"
//             height="12"
//             viewBox="0 0 12 12"
//             xmlns="http://www.w3.org/2000/svg"
//         >
//             <path
//                 fill-rule="evenodd"
//                 clip-rule="evenodd"
//                 d="M1.70757 0.280712C1.51897 0.0985538 1.26637 -0.00224062 1.00417 3.78026e-05C0.741971 0.00231622 0.491159 0.107485 0.305751 0.292893C0.120343 0.478301 0.0151738 0.729114 0.0128954 0.991311C0.010617 1.25351 0.111411 1.50611 0.293569 1.69471L4.58657 5.98771L0.293569 10.2807C0.198059 10.373 0.121877 10.4833 0.0694681 10.6053C0.0170591 10.7273 -0.0105272 10.8585 -0.011681 10.9913C-0.0128348 11.1241 0.0124669 11.2558 0.0627478 11.3787C0.113029 11.5016 0.187282 11.6132 0.281174 11.7071C0.375067 11.801 0.486719 11.8753 0.609615 11.9255C0.732512 11.9758 0.864191 12.0011 0.996971 12C1.12975 11.9988 1.26097 11.9712 1.38297 11.9188C1.50498 11.8664 1.61532 11.7902 1.70757 11.6947L6.00057 7.40171L10.2936 11.6947C10.4822 11.8769 10.7348 11.9777 10.997 11.9754C11.2592 11.9731 11.51 11.8679 11.6954 11.6825C11.8808 11.4971 11.986 11.2463 11.9882 10.9841C11.9905 10.7219 11.8897 10.4693 11.7076 10.2807L7.41457 5.98771L11.7076 1.69471C11.8897 1.50611 11.9905 1.25351 11.9882 0.991311C11.986 0.729114 11.8808 0.478301 11.6954 0.292893C11.51 0.107485 11.2592 0.00231622 10.997 3.78026e-05C10.7348 -0.00224062 10.4822 0.0985538 10.2936 0.280712L6.00057 4.57371L1.70757 0.280712Z"
//                 fill="currentColor"
//             />
//         </svg>
//     );
// };

// const ArrowBack = () => {
//     return (
//         <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//         >
//             <path
//                 d="M19.701 12.0001C19.701 11.4478 19.2533 11.0001 18.701 11.0001H7.50101L12.401 6.10011C12.7876 5.71351 12.7876 5.08671 12.401 4.70011C12.0144 4.31351 11.3876 4.31351 11.001 4.70011L4.40812 11.293C4.0176 11.6835 4.0176 12.3167 4.40812 12.7072L11.001 19.3001C11.3876 19.6867 12.0144 19.6867 12.401 19.3001C12.7876 18.9135 12.7876 18.2867 12.401 17.9001L7.50101 13.0001H18.701C19.2533 13.0001 19.701 12.5524 19.701 12.0001Z"
//                 fill="white"
//             />
//         </svg>
//     );
// };