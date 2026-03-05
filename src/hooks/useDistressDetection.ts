import { useState, useCallback } from 'react';
import { DISTRESS_KEYWORDS } from '../constants/distressKeywords';

interface DistressResult {
  isDistressed: boolean;
  matchedKeywords: string[];
}

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const useDistressDetection = () => {
  const [showAlert, setShowAlert] = useState(false);

  const checkForDistress = useCallback((text: string): DistressResult => {
    const normalizedInput = normalizeText(text);
    const matchedKeywords = DISTRESS_KEYWORDS.filter((keyword) => {
      const normalizedKeyword = normalizeText(keyword);
      return normalizedInput.includes(normalizedKeyword);
    });

    const isDistressed = matchedKeywords.length > 0;
    if (isDistressed) {
      setShowAlert(true);
    }

    return { isDistressed, matchedKeywords };
  }, []);

  const dismissAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  return {
    checkForDistress,
    showAlert,
    dismissAlert,
  };
};
