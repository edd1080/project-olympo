
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface FloatingPrequalificationButtonProps {
  onClick: () => void;
}

const FloatingPrequalificationButton: React.FC<FloatingPrequalificationButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg z-40 bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-110"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default FloatingPrequalificationButton;
