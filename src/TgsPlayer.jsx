import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { gunzipSync } from 'fflate';           // 🔽 tiny gzip/deflate lib

/**
 * Props:
 *   path      – public path or full URL to the .tgs file
 *   loop      – true | false | number  (lottie‑web loop param)
 *   autoplay  – true | false
 *   className – optional Tailwind / CSS classes
 */
const TgsPlayer = ({
  path,
  loop = true,
  autoplay = true,
  className = '',
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let anim;             // lottie instance
    let cancelled = false;

    /** 1) Fetch the .tgs as binary */
    fetch(path)
      .then(r => r.arrayBuffer())
      .then(buf => {
        /** 2) Gun‑zip -> Uint8Array -> string */
        const jsonText = new TextDecoder().decode(gunzipSync(new Uint8Array(buf)));
        const animationData = JSON.parse(jsonText);

        if (cancelled) return;

        /** 3) Spin up lottie‑web */
        anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop,
          autoplay,
          animationData,
        });
      })
      .catch(err => console.error('Could not load .tgs:', err));

    /** 4) Tear‑down on unmount */
    return () => {
      cancelled = true;
      if (anim) anim.destroy();
    };
  }, [path, loop, autoplay]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', minHeight: 250 }}
    />
  );
};

export default TgsPlayer;
