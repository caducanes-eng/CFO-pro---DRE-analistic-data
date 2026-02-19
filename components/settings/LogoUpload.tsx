import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import Button from '../ui/Button';

interface LogoUploadProps {
  currentLogoUrl?: string; // This will now be the processed URL
  isLoading?: boolean; // New prop to indicate if theme generation is in progress
  onLogoFileChange: (rawBase64: string | null) => void; // Emits raw base64 of the file
  onRemoveLogo: () => void;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ currentLogoUrl, isLoading = false, onLogoFileChange, onRemoveLogo }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Internal state for raw preview (before processing), not for persistence
  const [rawPreviewUrl, setRawPreviewUrl] = useState<string | null>(currentLogoUrl || null);

  // Update internal preview when currentLogoUrl (processed) changes or is cleared
  // This helps when theme generation is fast or logo is removed
  React.useEffect(() => {
    setRawPreviewUrl(currentLogoUrl || null);
  }, [currentLogoUrl]);

  const processFile = useCallback((file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const rawBase64 = reader.result as string;
        setRawPreviewUrl(rawBase64); // Show raw file preview immediately
        onLogoFileChange(rawBase64); // Pass raw base64 to parent for theme generation
      };
      reader.readAsDataURL(file);
    }
  }, [onLogoFileChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault(); // Prevent default paste behavior
          processFile(file);
          return;
        }
      }
    }
  }, [processFile]);

  const handleRemove = () => {
    setRawPreviewUrl(null);
    onRemoveLogo(); // Notify parent to clear logo and reset theme
    if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear file input
    }
  };

  return (
    <div
      className="bg-[var(--brand-surface)]/20 border border-white/10 rounded-xl p-5 flex flex-col items-center justify-center text-center relative" /* Reduzido p-6 para p-5 */
      onPaste={handlePaste}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; }}
      onDrop={(e) => {
        e.preventDefault(); e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
          processFile(file);
        } else if (file) {
            alert('Por favor, arraste um arquivo de imagem (JPG, PNG, GIF).');
        }
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="logo-upload-input"
        disabled={isLoading}
      />

      {isLoading ? (
        <div className="w-28 h-28 bg-[var(--brand-surface)]/30 rounded-lg flex flex-col items-center justify-center text-[var(--brand-primary)] mb-4 animate-pulse"> {/* Reduzido w-32 h-32 para w-28 h-28 */}
          <Loader2 size={28} className="animate-spin mb-2" /> {/* Reduzido size={32} para size={28} */}
          <span className="text-xs text-[var(--brand-text-muted)]">Processando...</span>
        </div>
      ) : rawPreviewUrl ? (
        <div className="relative group w-28 h-28 mb-4"> {/* Reduzido w-32 h-32 para w-28 h-28 */}
          <img src={rawPreviewUrl} alt="Company Logo Preview" className="w-full h-full object-contain rounded-lg border border-white/10" />
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remover logo"
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div className="w-28 h-28 bg-[var(--brand-surface)]/20 rounded-lg flex items-center justify-center text-[var(--brand-text-muted)] mb-4"> {/* Reduzido w-32 h-32 para w-28 h-28 */}
          <ImageIcon size={40} /> {/* Reduzido size={48} para size={40} */}
        </div>
      )}

      <Button
        type="button"
        size="sm"
        className="inline-flex items-center"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
      >
        <UploadCloud size={18} className="mr-2" />
        {rawPreviewUrl ? 'Alterar Logo' : 'Upload Logo'}
      </Button>
      <label htmlFor="logo-upload-input" className="sr-only">Upload Company Logo</label>

      <p className="text-[var(--brand-text-muted)] text-xs mt-2">
        Arraste, clique ou <span className="font-semibold text-[var(--brand-primary)]">cole (Ctrl+V)</span> seu logo aqui. Formatos: JPG, PNG, GIF.
        <br/>
        <span className="text-[var(--brand-text-muted)] text-xs mt-1">Fundo pode ser removido e cores extraídas automaticamente.</span>
      </p>
    </div>
  );
};

export default LogoUpload;