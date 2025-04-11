import React from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const RequestForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    creditAmount: '',
    terms: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    description: '',
  });

  const { toast } = useToast()

  useEffect(() => {
    if (id) {
      // Fetch existing application data for editing
      // Replace this with your actual API call
      fetch(`/api/applications/${id}`)
        .then(response => response.json())
        .then(data => {
          setFormData(data);
        })
        .catch(error => {
          console.error('Error fetching application:', error);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Replace this with your actual API endpoint
      const response = await fetch('/api/applications', {
        method: id ? 'PUT' : 'POST', // Use PUT for editing
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your application has been saved.",
        })
        navigate('/applications');
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
        console.error('Error saving application:', response.status);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
      console.error('Error saving application:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header personName={formData.fullName || "Nueva Solicitud"} />
      
      <main className="flex-1 px-4 py-6 pb-20">
        <div className="container max-w-2xl mx-auto py-10">
          <Card>
            <CardHeader>
              <CardTitle>Solicitud de Crédito</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Nombre Completo</Label>
                  <Input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre completo"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ingresa tu correo electrónico"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ingresa tu número de teléfono"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="creditAmount">Monto del Crédito</Label>
                  <Input
                    type="number"
                    id="creditAmount"
                    name="creditAmount"
                    value={formData.creditAmount}
                    onChange={handleChange}
                    placeholder="Ingresa el monto del crédito deseado"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="terms">Plazos (meses)</Label>
                  <Input
                    type="number"
                    id="terms"
                    name="terms"
                    value={formData.terms}
                    onChange={handleChange}
                    placeholder="Ingresa el plazo en meses"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Ingresa tu dirección"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Ingresa tu ciudad"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Ingresa tu estado"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="zip">Código Postal</Label>
                    <Input
                      type="text"
                      id="zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder="Ingresa tu código postal"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Ingresa tu país"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Ingresa una descripción"
                  />
                </div>
                <Button type="submit">{id ? 'Actualizar Solicitud' : 'Enviar Solicitud'}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default RequestForm;
