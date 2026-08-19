import { useState, useEffect, useCallback } from 'react';
import { ThemeConfig, ThemePeriod } from '../types';
import { THEMES } from '../lib/constants';

export function useTimeTheme() {
  const [currentPeriod, setCurrentPeriod] = useState<ThemePeriod>(() => getPeriodByTime());
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState<string>('');

  function getPeriodByTime(): ThemePeriod {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 8) {
      return 'cheshire_night';
    } else if (currentHour >= 8 && currentHour < 16) {
      return 'mad_hatter_day';
    } else {
      return 'queen_of_hearts_evening';
    }
  }

  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeFormatted(`${hours}:${minutes}`);

      if (!isManualOverride) {
        const period = getPeriodByTime();
        if (period !== currentPeriod) {
          setCurrentPeriod(period);
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [isManualOverride, currentPeriod]);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentPeriod);
  }, [currentPeriod]);

  const setManualTheme = useCallback((period: ThemePeriod) => {
    setIsManualOverride(true);
    setCurrentPeriod(period);
  }, []);

  const resetToRealTime = useCallback(() => {
    setIsManualOverride(false);
    setCurrentPeriod(getPeriodByTime());
  }, []);

  const currentTheme: ThemeConfig = THEMES[currentPeriod] || THEMES.cheshire_night;

  return {
    currentTheme,
    currentPeriod,
    isManualOverride,
    currentTimeFormatted,
    setManualTheme,
    resetToRealTime,
    allThemes: Object.values(THEMES),
  };
}
