// class DeepLinkService {
//     constructor() {
//         // Инжектим window / document / location / storage из окружения
//         this.windowRef = (0, m.WQX)(ce.Qc);
//         this.documentRef = (0, m.WQX)(m.qQL);
//         this.locationRef = (0, m.WQX)(ce.zz);
//         this.storageRef = (0, m.WQX)(ni.i);
//     }

//     /**
//      * Открывает один диплинк.
//      * @param url             — ссылка (deeplink / https)
//      * @param openInNewTab    — если true, открываем в новой вкладке
//      */
//     openDeepLink(url, openInNewTab = false) {
//         if (openInNewTab) {
//             this.windowRef.open(url, '_blank');
//         } else {
//             this.locationRef.href = url;
//         }
//     }

//     /**
//      * Открывает набор диплинков через промежуточную страницу links.html.
//      * Массив ссылок кладётся в storage и потом читается на links.html.
//      */
//     openDeepLinks(links) {
//         try {
//             const encodedLinks = encodeURIComponent(JSON.stringify(links));
//             this.storageRef.setItem('links', encodedLinks);
//         } catch {
//             // intentionally ignore storage errors
//         }

//         const baseElement = this.documentRef.querySelectorAll('base')[0];
//         const baseHref = baseElement ? baseElement.href : '';

//         const baseUrl = baseHref || `${this.windowRef.location.origin}/`;
//         this.locationRef.href = `${baseUrl}links.html`;
//     }
// }