import { useEffect, useState } from "react";

export function useClock() {
  const [now, setNow] = useState(new Date());

  // The clock is reusable UI state, so it lives in a hook instead of HomePage.
  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return now;
}
