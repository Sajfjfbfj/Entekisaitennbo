// これは create-react-app に基づく PWA サポート用のコードです

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] は IPv6 のローカルホスト
      window.location.hostname === '[::1]' ||
      // 127.0.0.0/8 の範囲はローカルホスト用
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/
      )
  );
  
  export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
      if (publicUrl.origin !== window.location.origin) {
        return;
      }
  
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
        if (isLocalhost) {
          // ローカル環境での動作確認用
          checkValidServiceWorker(swUrl, config);
  
          navigator.serviceWorker.ready.then(() => {
            console.log(
              'このウェブアプリはオフラインでも動作するようになっています。'
            );
          });
        } else {
          // 本番環境での登録
          registerValidSW(swUrl, config);
        }
      });
    }
  }
  
  function registerValidSW(swUrl, config) {
    navigator.serviceWorker
      .register(swUrl)
      .then(registration => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // 新しいコンテンツが利用可能
                console.log('新しいコンテンツがあります。ページをリロードしてください。');
  
                if (config && config.onUpdate) {
                  config.onUpdate(registration);
                }
              } else {
                // コンテンツはキャッシュされ、オフラインでも使えます
                console.log('コンテンツはキャッシュされ、オフラインでも利用できます。');
  
                if (config && config.onSuccess) {
                  config.onSuccess(registration);
                }
              }
            }
          };
        };
      })
      .catch(error => {
        console.error('Service worker の登録中にエラーが発生しました:', error);
      });
  }
  
  function checkValidServiceWorker(swUrl, config) {
    // Service Worker が正しく存在するかチェック
    fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    })
      .then(response => {
        const contentType = response.headers.get('content-type');
        if (
          response.status === 404 ||
          (contentType != null && contentType.indexOf('javascript') === -1)
        ) {
          // Service worker が存在しない。古いキャッシュをクリア。
          navigator.serviceWorker.ready.then(registration => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          // 正常な service worker を登録
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log('オフラインのようです。PWAモードで動作中です。');
      });
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(registration => {
          registration.unregister();
        })
        .catch(error => {
          console.error(error.message);
        });
    }
  }
  