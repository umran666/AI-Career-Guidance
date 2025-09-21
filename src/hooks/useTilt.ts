import { useRef, useEffect } from 'react';

interface Options {
  maxTilt?: number; // degrees
  scale?: number;
  transition?: number; // ms
}

export default function useTilt(options: Options = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const opts = {
    maxTilt: 12,
    scale: 1.02,
    transition: 150,
    ...options,
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let width = 0;
    let height = 0;
    let left = 0;
    let top = 0;

    function setBounds() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      left = rect.left + window.scrollX;
      top = rect.top + window.scrollY;
    }

    function onMove(e: PointerEvent) {
      if (!el) return;
      if (!width || !height) setBounds();
      const x = (e.pageX - left) / width;
      const y = (e.pageY - top) / height;

      const tiltX = (opts.maxTilt / 2 - x * opts.maxTilt).toFixed(2);
      const tiltY = (y * opts.maxTilt - opts.maxTilt / 2).toFixed(2);

      el.style.transform = `perspective(900px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(${opts.scale})`;
      el.style.transition = `transform ${opts.transition}ms cubic-bezier(.2,.9,.2,1)`;
    }

    function onEnter() {
      if (!el) return;
      setBounds();
      el.style.willChange = 'transform';
    }

    function onLeave() {
      if (!el) return;
      el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)`;
      el.style.transition = `transform ${opts.transition}ms cubic-bezier(.2,.9,.2,1)`;
      el.style.willChange = '';
    }

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);

    window.addEventListener('resize', setBounds);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', setBounds);
    };
  }, [opts.maxTilt, opts.scale, opts.transition]);

  return ref;
}
