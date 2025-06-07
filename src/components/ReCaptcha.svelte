<script>
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public'; // Ensure this is your v2 Site Key

  const dispatch = createEventDispatcher();
  const siteKey = PUBLIC_RECAPTCHA_SITE_KEY;
  let widgetId = null;
  let recaptchaContainer = null; // Element to render into

  // Name of the global callback function that reCAPTCHA will call
  const globalCallbackName = 'onRecaptchaVerified_' + Math.random().toString(36).substring(7);
  const globalExpiredCallbackName = 'onRecaptchaExpired_' + Math.random().toString(36).substring(7);
  const globalErrorCallbackName = 'onRecaptchaError_' + Math.random().toString(36).substring(7);
  const globalOnRecaptchaLoadName = 'onRecaptchaLoad_' + Math.random().toString(36).substring(7);

  onMount(() => {
    window[globalCallbackName] = (token) => {
      dispatch('verified', { token });
    };
    window[globalExpiredCallbackName] = () => {
      dispatch('expired');
    };
    window[globalErrorCallbackName] = () => {
      dispatch('error', { message: 'reCAPTCHA error callback triggered' });
    };

    window[globalOnRecaptchaLoadName] = () => {
      if (recaptchaContainer && window.grecaptcha && window.grecaptcha.render) {
        try {
          widgetId = window.grecaptcha.render(recaptchaContainer, {
            'sitekey': siteKey,
            'callback': globalCallbackName,
            'expired-callback': globalExpiredCallbackName,
            'error-callback': globalErrorCallbackName
          });
        } catch (e) {
          console.error("Error rendering reCAPTCHA: ", e);
          dispatch('error', { message: 'Failed to render reCAPTCHA: ' + e.message });
        }
      }
    };

    if (window.grecaptcha && window.grecaptcha.render && typeof window.grecaptcha.render === 'function') {
       // If script is already loaded and render function exists
      window[globalOnRecaptchaLoadName]();
    } else {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?onload=${globalOnRecaptchaLoadName}&render=explicit`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      delete window[globalCallbackName];
      delete window[globalExpiredCallbackName];
      delete window[globalErrorCallbackName];
      delete window[globalOnRecaptchaLoadName];
      // Clean up the reCAPTCHA widget if it was rendered
      // This is tricky because the reCAPTCHA API doesn't offer a direct unmount for explicit renders.
      // Clearing the container is usually enough.
      if (recaptchaContainer) recaptchaContainer.innerHTML = ''; 
    };
  });

  // Exported functions for parent component interaction if necessary
  export function getToken() {
    if (window.grecaptcha && widgetId !== null) {
      return window.grecaptcha.getResponse(widgetId);
    }
    return null;
  }

  export function reset() {
    if (window.grecaptcha && widgetId !== null) {
      try {
        window.grecaptcha.reset(widgetId);
        dispatch('reset');
      } catch (e) {
        console.error('Error resetting reCAPTCHA:', e);
      }
    }
  }

</script>

<div bind:this={recaptchaContainer}>
  <!-- reCAPTCHA will render here -->
</div>
<noscript>
  <div>This site requires JavaScript for reCAPTCHA.</div>
</noscript>