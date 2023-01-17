import { detectLocale, i18n, isLocale } from '$i18n/i18n-util';
import { loadAllLocales } from '$i18n/i18n-util.sync';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';

loadAllLocales();
const L = i18n();

export const handle = async ({ event, resolve }) => {
	// read language slug
	const [, lang] = event.url.pathname.split('/');

	// if slug is not a locale, use base locale (e.g. api endpoints)
	const locale = isLocale(lang) ? lang : getPreferredLocale(event);

	// const locale = isLocale(lang) ? (lang as Locales) : getPreferredLocale(event)
	const LL = L[locale];

	// bind locale and translation functions to current request
	event.locals.locale = locale;
	event.locals.LL = LL;
	console.log('🚀 ~ file: hooks.server.js:21 ~ handle ~ LL', LL);
	// replace html lang attribute with correct language
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', locale)
	});
};

const getPreferredLocale = ({ request }) => {
	// detect the preferred language the user has configured in his browser
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector(request);

	return detectLocale(acceptLanguageDetector);
};
