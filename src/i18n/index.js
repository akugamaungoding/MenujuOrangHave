import { useState, useEffect } from 'react';
import enTranslations from './en.json';

// Supported locales map with currently loaded dictionary
const translations = {
  en: enTranslations,
};

let currentLocale = 'en';
const listeners = new Set();

/**
 * Resolve a dot-notation key in an object.
 * e.g. "story.cover_title" -> object.story.cover_title
 */
function resolveKey(obj, keyPath) {
  if (!obj || !keyPath) return undefined;
  const segments = keyPath.split('.');
  let current = obj;
  for (const segment of segments) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = current[segment];
  }
  return current;
}

/**
 * Get current active locale code (e.g. 'en', 'id')
 */
export function getLocale() {
  return currentLocale;
}

/**
 * Translate a key with optional fallback or variable interpolation.
 * Supports dot-notation, e.g. t('story.cover_title') or t('common.source')
 *
 * @param {string} key - Dot notation key
 * @param {object|string} [paramsOrFallback] - Variables object e.g. { count: 5 } or string fallback
 * @returns {string|any}
 */
export function t(key, paramsOrFallback) {
  if (!key) return '';

  const activeDict = translations[currentLocale] || translations.en;
  let value = resolveKey(activeDict, key);

  // Fallback to English if missing in current locale
  if (value === undefined && currentLocale !== 'en') {
    value = resolveKey(translations.en, key);
  }

  // If still not found
  if (value === undefined) {
    if (typeof paramsOrFallback === 'string') {
      return paramsOrFallback;
    }
    return key;
  }

  // If the translation is not a string (e.g. array of claims or object)
  if (typeof value !== 'string') {
    return value;
  }

  // Variable interpolation: replace {varName} with param value
  if (paramsOrFallback && typeof paramsOrFallback === 'object') {
    return value.replace(/\{(\w+)\}/g, (_, match) => {
      return paramsOrFallback[match] !== undefined ? paramsOrFallback[match] : `{${match}}`;
    });
  }

  return value;
}

/**
 * Change current locale with lazy-loading support for Indonesian ('id').
 *
 * @param {string} locale
 * @returns {Promise<string>} Active locale
 */
export async function setLocale(locale) {
  if (!locale) return currentLocale;
  const target = locale.toLowerCase();

  if (target === currentLocale) {
    return currentLocale;
  }

  if (target === 'en') {
    currentLocale = 'en';
    notifyListeners();
    return currentLocale;
  }

  if (target === 'id') {
    if (!translations.id) {
      try {
        // Attempt lazy-load Indonesian dictionary if file exists
        const module = await import('./id.json');
        translations.id = module.default || module;
      } catch (err) {
        console.warn(`[i18n] Failed to load translations for "${target}". Falling back to English.`, err);
        translations.id = translations.en;
      }
    }
    currentLocale = 'id';
    notifyListeners();
    return currentLocale;
  }

  console.warn(`[i18n] Unsupported locale "${locale}". Remaining on "${currentLocale}".`);
  return currentLocale;
}

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener(currentLocale);
    } catch (e) {
      console.error('[i18n] Listener error:', e);
    }
  });
}

/**
 * React hook for components to subscribe to translation changes.
 * Returns { t, locale, setLocale }
 */
export function useTranslation() {
  const [locale, setLocalLocale] = useState(currentLocale);

  useEffect(() => {
    const handler = (newLocale) => setLocalLocale(newLocale);
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  return {
    t,
    locale,
    setLocale,
  };
}

export default {
  t,
  getLocale,
  setLocale,
  useTranslation,
};
