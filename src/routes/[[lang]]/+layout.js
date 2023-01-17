import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { setLocale } from '$i18n/i18n-svelte';
import { isLocale } from '$i18n/i18n-util';
import { redirect } from '@sveltejs/kit';

export const load = async ({ data: { locale }, params: { lang } }) => {
	// redirect to base locale if no locale slug was found
	if (lang && !isLocale(lang)) {
		throw redirect(303, '/');
	}

	await loadLocaleAsync(locale);
	setLocale(locale);
};
