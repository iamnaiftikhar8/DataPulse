'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import FullScreenLoader from './ScreenLoader';

export default function RouteChangeOverlay() {
  const pathname = usePathname();
  const [show, setShow] = React.useState(false);

  // whenever the path changes, briefly show the loader
  React.useEffect(() => {
    // prevent flash on first render
    if (!pathname) return;

    setShow(true);
    const t = setTimeout(() => setShow(false), 400); // adjust duration
    return () => clearTimeout(t);
  }, [pathname]);

  if (!show) return null;
  return <FullScreenLoader />;
}
