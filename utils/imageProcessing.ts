// utils/imageProcessing.ts
import { DEFAULT_COLOR_PALETTE } from '../constants'; // Importa a paleta padrão

/**
 * Converts an RGB color to HSL.
 * @param r Red value (0-255).
 * @param g Green value (0-255).
 * @param b Blue value (0-255).
 * @returns An array [h, s, l] where h, s, l are in [0, 1].
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

/**
 * Converts an HSL color to RGB.
 * @param h Hue (0-1).
 * @param s Saturation (0-1).
 * @param l Lightness (0-1).
 * @returns An array [r, g, b] where r, g, b are in [0, 255].
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Adjusts the lightness of an RGB color.
 * @param color RGB array [r, g, b].
 * @param deltaL Change in lightness (-1 to 1).
 * @returns Adjusted RGB array.
 */
function adjustLightness(color: [number, number, number], deltaL: number): [number, number, number] {
    let [h, s, l] = rgbToHsl(color[0], color[1], color[2]);
    l = Math.max(0, Math.min(1, l + deltaL));
    return hslToRgb(h, s, l);
}

/**
 * Adjusts the saturation of an RGB color.
 * @param color RGB array [r, g, b].
 * @param deltaS Change in saturation (-1 to 1).
 * @returns Adjusted RGB array.
 */
function adjustSaturation(color: [number, number, number], deltaS: number): [number, number, number] {
    let [h, s, l] = rgbToHsl(color[0], color[1], color[2]);
    s = Math.max(0, Math.min(1, s + deltaS));
    return hslToRgb(h, s, l);
}

/**
 * Converts an RGB array to a hex string.
 * @param rgb RGB array [r, g, b].
 * @returns Hex string (e.g., "#RRGGBB").
 */
function rgbToHex([r, g, b]: [number, number, number]): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

/**
 * Converts a hex color string to an RGB array.
 * @param hex Hex color string (e.g., "#RRGGBB" or "RRGGBB").
 * @returns RGB array [r, g, b] or null if invalid.
 */
function hexToRgb(hex: string): [number, number, number] | null {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return [r, g, b];
}

/**
 * Mixes two colors together by a given ratio.
 * @param color1 Hex string for the first color.
 * @param color2 Hex string for the second color.
 * @param ratio Ratio of color2 to color1 (0.0 to 1.0).
 * @returns Hex string of the mixed color.
 */
function mixColors(color1: string, color2: string, ratio: number): string {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) {
        console.warn("Invalid color format provided to mixColors.");
        return color1; // Fallback
    }

    const r = Math.round(rgb1[0] * (1 - ratio) + rgb2[0] * ratio);
    const g = Math.round(rgb1[1] * (1 - ratio) + rgb2[1] * ratio);
    const b = Math.round(rgb1[2] * (1 - ratio) + rgb2[2] * ratio);

    return rgbToHex([r, g, b]);
}


/**
 * Simulates AI background removal and automatic cropping using Canvas API.
 * This is a heuristic and may not be perfect for all images.
 * It assumes a relatively uniform background, especially at the edges.
 * @param imageSrc Base64 or URL of the image.
 * @returns Promise resolving to the processed image's Base64 URL.
 */
export async function removeBackgroundAndCrop(imageSrc: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageSrc;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error("Could not get canvas context."));
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imageData.data;

            // --- Simplified Background Removal Heuristic ---
            // Sample corner pixels to guess background color
            const corners = [
                data[0], data[1], data[2], // Top-left
                data[4 * (canvas.width - 1)], data[4 * (canvas.width - 1) + 1], data[4 * (canvas.width - 1) + 2], // Top-right
                data[4 * (canvas.width * (canvas.height - 1))], data[4 * (canvas.width * (canvas.height - 1)) + 1], data[4 * (canvas.width * (canvas.height - 1)) + 2], // Bottom-left
                data[4 * (canvas.width * canvas.height - 1)], data[4 * (canvas.width * canvas.height - 1) + 1], data[4 * (canvas.width * canvas.height - 1) + 2] // Bottom-right
            ];
            const avgBgR = (corners[0] + corners[3] + corners[6] + corners[9]) / 4;
            const avgBgG = (corners[1] + corners[4] + corners[7] + corners[10]) / 4;
            const avgBgB = (corners[2] + corners[5] + corners[8] + corners[11]) / 4;

            const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
                const dr = r1 - r2;
                const dg = g1 - g2;
                const db = b1 - b2;
                return Math.sqrt(dr * dr + dg * dg + db * db);
            };

            const threshold = 60; // How "close" a color needs to be to the background to be made transparent

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                // Check if pixel is close to the guessed background color
                if (colorDistance(r, g, b, avgBgR, avgBgG, avgBgB) < threshold) {
                    data[i + 3] = 0; // Set alpha to 0 (transparent)
                }
            }
            ctx.putImageData(imageData, 0, 0);

            // --- Automatic Cropping ---
            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
            let foundPixel = false;

            imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            data = imageData.data;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const alpha = data[((y * canvas.width) + x) * 4 + 3];
                    if (alpha > 0) { // If not transparent
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                        foundPixel = true;
                    }
                }
            }

            if (!foundPixel) {
                // If no opaque pixels, return original or a blank canvas
                return resolve(canvas.toDataURL('image/png'));
            }

            const croppedWidth = maxX - minX + 1;
            const croppedHeight = maxY - minY + 1;

            const croppedCanvas = document.createElement('canvas');
            const croppedCtx = croppedCanvas.getContext('2d');
            if (!croppedCtx) {
                return reject(new Error("Could not get cropped canvas context."));
            }
            croppedCanvas.width = croppedWidth;
            croppedCanvas.height = croppedHeight;
            croppedCtx.drawImage(canvas, minX, minY, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);

            resolve(croppedCanvas.toDataURL('image/png'));
        };

        img.onerror = (e) => reject(e);
    });
}


/**
 * Extracts a simplified color palette from an image.
 * This is a heuristic and does not use advanced clustering algorithms.
 * @param imageSrc Base64 or URL of the image.
 * @returns Promise resolving to an object with primary, secondary, accent, bgTint, and brandSurface colors in hex/rgba format.
 */
export async function extractPalette(imageSrc: string): Promise<{ primary: string; secondary: string; accent: string; bgTint: string; brandSurface: string; brandTextLight: string; brandTextMuted: string; }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageSrc;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error("Could not get canvas context for color extraction."));
            }

            // Scale down image for performance
            const scaleFactor = 0.1;
            canvas.width = img.width * scaleFactor;
            canvas.height = img.height * scaleFactor;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                const colorCounts: { [key: string]: number } = {};
                let dominantColor: [number, number, number] = [0, 0, 0];
                let maxCount = 0;

                // Sample pixels for dominant color
                const step = 5; // Sample every 5th pixel
                for (let i = 0; i < data.length; i += 4 * step) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const a = data[i + 3];

                    // Ignore transparent or near-black/near-white pixels to focus on "color"
                    if (a > 128 && (r > 20 && g > 20 && b > 20) && (r < 235 && g < 235 && b < 235)) {
                        const rgb = `${r},${g},${b}`;
                        colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
                        if (colorCounts[rgb] > maxCount) {
                            maxCount = colorCounts[rgb];
                            dominantColor = [r, g, b];
                        }
                    }
                }

                if (maxCount === 0) { // Fallback if no dominant color found (e.g., all black/white or transparent)
                    // Use the new default palette in case of fallback
                    return resolve(DEFAULT_COLOR_PALETTE);
                }
                
                const primary = rgbToHex(dominantColor);

                // Derive secondary and accent colors based on dominant color (simplified heuristics)
                let [h, s, l] = rgbToHsl(dominantColor[0], dominantColor[1], dominantColor[2]);

                // Adjust hue slightly for secondary and accent to create a harmonious gold/bronze effect
                const secondaryH = (h + 0.05) % 1; // Slight shift for secondary
                const accentH = (h - 0.05 + 1) % 1; // Slight shift for accent

                const secondaryS = Math.min(1, s * 0.8); // Slightly desaturate secondary
                const accentS = Math.min(1, s * 1.2);   // Slightly boost accent saturation

                const secondaryL = Math.max(0.1, l * 0.7); // Darker secondary
                const accentL = Math.min(0.9, l * 1.1);    // Lighter accent

                const secondaryRgb = hslToRgb(secondaryH, secondaryS, secondaryL);
                const secondary = rgbToHex(secondaryRgb);

                const accentRgb = hslToRgb(accentH, accentS, accentL);
                const accent = rgbToHex(accentRgb);

                // Background tint: very dark, slightly desaturated primary
                const bgTintRgb = adjustSaturation(adjustLightness(dominantColor, -0.6), -0.5);
                const bgTint = `rgba(${bgTintRgb[0]}, ${bgTintRgb[1]}, ${bgTintRgb[2]}, 0.08)`; // 0.08 alpha

                // Brand Surface: Base dark gray (#121217) mixed with 5% of the primary color
                const baseDarkGray = '#121217'; 
                const brandSurface = mixColors(baseDarkGray, primary, 0.05);

                // Text colors
                const brandTextLight = '#E0E0E0'; // Consistent soft white
                const brandTextMuted = 'rgba(255, 255, 255, 0.6)'; // Consistent muted white

                resolve({ primary, secondary, accent, bgTint, brandSurface, brandTextLight, brandTextMuted });

            } catch (e) {
                console.error("Error reading image data for palette extraction:", e);
                reject(e);
            }
        };

        img.onerror = (e) => reject(e);
    });
}