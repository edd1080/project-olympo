import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, Download, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoUrl: string;
  title: string;
  geotag?: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  timestamp?: string;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({
  isOpen,
  onClose,
  photoUrl,
  title,
  geotag,
  timestamp
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = `${title}_${timestamp || new Date().toISOString()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
        <div className="relative w-full h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-background">
            <h3 className="font-semibold text-lg">{title}</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center p-4 bg-black/5">
            <img
              src={photoUrl}
              alt={title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>

          {/* Footer with metadata */}
          {(geotag || timestamp) && (
            <div className="p-4 border-t bg-background space-y-2">
              {geotag && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>
                    Lat: {geotag.lat.toFixed(6)}, Lng: {geotag.lng.toFixed(6)}
                  </span>
                  <span className="ml-2">
                    Precisión: ±{Math.round(geotag.accuracy)}m
                  </span>
                </div>
              )}
              {timestamp && (
                <div className="text-sm text-muted-foreground">
                  Capturada: {new Date(timestamp).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};