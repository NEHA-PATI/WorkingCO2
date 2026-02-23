import { useEffect, useMemo, useState } from 'react';

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;

const toMs = (targetTime) => {
  if (!targetTime) return null;
  const parsed = new Date(targetTime).getTime();
  return Number.isFinite(parsed) ? parsed : null;
};

const getRemainingMs = (targetMs) => {
  if (!targetMs) return 0;
  return Math.max(targetMs - Date.now(), 0);
};

const pad2 = (value) => String(value).padStart(2, '0');

const formatRemaining = (remainingMs) => {
  const hours = Math.floor(remainingMs / ONE_HOUR);
  const minutes = Math.floor((remainingMs % ONE_HOUR) / ONE_MINUTE);
  const seconds = Math.floor((remainingMs % ONE_MINUTE) / ONE_SECOND);
  return `${pad2(hours)}h ${pad2(minutes)}m ${pad2(seconds)}s`;
};

export const useCountdown = (targetTime) => {
  const [remainingMs, setRemainingMs] = useState(() => {
    const targetMs = toMs(targetTime);
    return getRemainingMs(targetMs);
  });

  useEffect(() => {
    const targetMs = toMs(targetTime);

    if (!targetMs) {
      setRemainingMs(0);
      return undefined;
    }

    setRemainingMs(getRemainingMs(targetMs));

    const timer = setInterval(() => {
      setRemainingMs((current) => {
        if (current <= 0) {
          clearInterval(timer);
          return 0;
        }

        const next = getRemainingMs(targetMs);
        if (next <= 0) {
          clearInterval(timer);
          return 0;
        }

        return next;
      });
    }, ONE_SECOND);

    return () => clearInterval(timer);
  }, [targetTime]);

  const formatted = useMemo(
    () => formatRemaining(remainingMs),
    [remainingMs]
  );

  return {
    remainingMs,
    formatted,
    isExpired: remainingMs <= 0
  };
};

export default useCountdown;
