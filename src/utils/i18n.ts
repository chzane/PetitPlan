// i18n
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../public/locales/en.json';
import zh_cn from '../../public/locales/zh-cn.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            zh_cn: { translation: zh_cn },
        },
        lng: 'zh_cn',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
