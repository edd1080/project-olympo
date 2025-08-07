import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Check } from 'lucide-react';

interface DocumentCardProps {
  title: string;
  description: string;
  isRequired?: boolean;
  value?: File | string | null;
  onChange: (file: File | null) => void;
}

const PhotoDocumentUploadCard: React.FC<DocumentCardProps> = ({
  title,
  description,
  isRequired = false,
  value,
  onChange
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleRemoveFile = () => {
    onChange(null);
  };

  const getFileName = () => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    return value.name;
  };

  const hasFile = !!value;

  return (
    <Card className={`transition-all duration-200 ${hasFile ? 'border-green-200 bg-green-50/50' : 'border-border'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              {title}
              {isRequired && <Badge variant="destructive" className="text-xs">Requerido</Badge>}
              {hasFile && <Badge variant="default" className="text-xs bg-green-600"><Check className="h-3 w-3 mr-1" />Completado</Badge>}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {hasFile && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center">
                <Upload className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{getFileName()}</span>
            </div>
            <Button
              onClick={handleRemoveFile}
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            id={`file-${title.replace(/\s/g, '-').toLowerCase()}`}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => document.getElementById(`file-${title.replace(/\s/g, '-').toLowerCase()}`)?.click()}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Subir Archivo
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Formatos aceptados: JPG, PNG, PDF
        </p>
      </CardContent>
    </Card>
  );
};

export default PhotoDocumentUploadCard;