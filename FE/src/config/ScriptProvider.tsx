import { useEffect } from 'react';

const loadScript = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(); // Already loaded
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = false; // Để giữ đúng thứ tự
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Script load error: ${src}`));
    document.body.appendChild(script);
  });
};

export const ScriptProvider = () => {
  useEffect(() => {
    const loadAllScripts = async () => {
      try {
        await loadScript('/assets/plugins/js/jquery.min.js');
        (window as any).$ = (window as any).jQuery;

        const scripts = [
          '/assets/plugins/js/owl.carousel.min.js',
          '/assets/plugins/js/slick.min.js',
          '/assets/plugins/js/select2.min.js',
          '/assets/plugins/js/jquery.easy-autocomplete.min.js',
          '/assets/plugins/js/loader.js',
          '/assets/plugins/js/bootsnav.js',
          '/assets/js/custom.js',
        ];

        for (const script of scripts) {
          await loadScript(script);
        }

        console.log('All scripts loaded');
      } catch (err) {
        console.error('Error loading scripts:', err);
      }
    };

    loadAllScripts();
  }, []);

  return null;
};
