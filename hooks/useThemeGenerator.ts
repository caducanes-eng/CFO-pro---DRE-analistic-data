// hooks/useThemeGenerator.ts
import { useState, useEffect, useCallback } from 'react';
import { removeBackgroundAndCrop, extractPalette } from '../utils/imageProcessing';
import { localStorageService } from '../services/localStorageService';
import { DEFAULT_COLOR_PALETTE } from '../constants';
import { ColorPalette } from '../types';

interface ThemeGeneratorHook {
  processedLogoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgTintColor: string;
  brandSurface: string; // New: Derived surface color
  brandTextLight: string; // New: Light text color
  brandTextMuted: string; // New: Muted text color
  isLoadingTheme: boolean;
}

/**
 * React hook to process a raw logo image (Base64), remove its background, crop it,
 * extract a color palette, and persist theme elements.
 * @param rawLogoBase64 The raw Base64 string of the uploaded logo.
 * @returns An object containing the processed logo URL, color palette, and loading state.
 */
const useThemeGenerator = (rawLogoBase64: string | null): ThemeGeneratorHook => {
  const [processedLogoUrl, setProcessedLogoUrl] = useState<string | null>(() =>
    localStorageService.getItem('processedLogoUrl', null)
  );
  const [colorPalette, setColorPalette] = useState<ColorPalette>(() =>
    localStorageService.getItem('currentPalette', DEFAULT_COLOR_PALETTE)
  );
  const [isLoadingTheme, setIsLoadingTheme] = useState<boolean>(false);

  // Effect to process the raw logo and generate the theme
  useEffect(() => {
    const generateTheme = async () => {
      if (!rawLogoBase64) {
        // Reset to default theme if no logo
        setProcessedLogoUrl(null);
        setColorPalette(DEFAULT_COLOR_PALETTE);
        localStorageService.removeItem('processedLogoUrl');
        localStorageService.setItem('currentPalette', DEFAULT_COLOR_PALETTE);
        return;
      }

      setIsLoadingTheme(true);
      try {
        // 1. Process image (remove background, crop)
        const processedUrl = await removeBackgroundAndCrop(rawLogoBase64);
        setProcessedLogoUrl(processedUrl);
        localStorageService.setItem('processedLogoUrl', processedUrl);

        // 2. Extract color palette from the processed image
        const extractedColors = await extractPalette(processedUrl);
        setColorPalette(extractedColors);
        localStorageService.setItem('currentPalette', extractedColors);

      } catch (error) {
        console.error("Error generating theme from logo:", error);
        // Fallback to default theme on error
        setProcessedLogoUrl(null);
        setColorPalette(DEFAULT_COLOR_PALETTE);
        localStorageService.removeItem('processedLogoUrl');
        localStorageService.setItem('currentPalette', DEFAULT_COLOR_PALETTE);
      } finally {
        setIsLoadingTheme(false);
      }
    };

    generateTheme();
  }, [rawLogoBase64]);

  return {
    processedLogoUrl,
    primaryColor: colorPalette.primary,
    secondaryColor: colorPalette.secondary,
    accentColor: colorPalette.accent,
    bgTintColor: colorPalette.bgTint,
    brandSurface: colorPalette.brandSurface,
    brandTextLight: colorPalette.brandTextLight,
    brandTextMuted: colorPalette.brandTextMuted,
    isLoadingTheme,
  };
};

export default useThemeGenerator;