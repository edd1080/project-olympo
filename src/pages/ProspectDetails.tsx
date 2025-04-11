import React from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ProspectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Placeholder data for prospect details
  const prospectName = "Juan Pérez"; // Replace with actual data fetching
  const prospectDetails = {
    email: "juan.perez@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown",
    // Add more details as needed
  };

  const handleEdit = () => {
    navigate(`/prospect/${id}/edit`);
  };

  const handleDelete = () => {
    // Implement delete logic here
    console.log("Delete prospect", id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header personName={prospectName} />
      
      <main className="flex-1 px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{prospectName}</h1>
          <p className="text-muted-foreground">Detalles del prospecto</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Email:</strong> {prospectDetails.email}</p>
            <p><strong>Teléfono:</strong> {prospectDetails.phone}</p>
            <p><strong>Dirección:</strong> {prospectDetails.address}</p>
            {/* Add more details here */}
          </CardContent>
        </Card>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-auto flex h-8 w-8 p-0 data-[state=open]:bg-muted">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" /> Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ProspectDetails;
