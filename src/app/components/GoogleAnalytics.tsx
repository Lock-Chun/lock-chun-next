import Script from 'next/script';

const getMeasurementId = (): string | undefined => {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
};

export const GoogleAnalytics = () => {
  const measurementId = getMeasurementId();

  if (!measurementId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('GA Measurement ID (NEXT_PUBLIC_GA_MEASUREMENT_ID) not found. Skipping GA script injection.');
    }
    return null;
  }

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      {/* Initialize gtag and send initial page view */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;