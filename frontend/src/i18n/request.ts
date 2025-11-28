import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // If no locale is provided, default to 'en'
  if (!locale) {
    locale = 'en';
  }
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});