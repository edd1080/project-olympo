import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, Phone, MapPin, Calendar, Plus } from 'lucide-react';

const Prospects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [prospects, setProspects] = useState([
    { id: 1, name: 'Juan Pérez', phone: '5555-5555', location: 'Guatemala', lastContact: '2024-01-20', status: 'Nuevo' },
    { id: 2, name: 'María López', phone: '5555-5555', location: 'Mixco', lastContact: '2024-01-15', status: 'En Proceso' },
    { id: 3, name: 'Carlos Gómez', phone: '5555-5555', location: 'Villa Nueva', lastContact: '2024-01-10', status: 'Completado' },
  ]);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
    }
  }, [navigate]);

  const filteredProspects = prospects.filter(prospect =>
    prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.phone.includes(searchTerm) ||
    prospect.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 py-8 pb-20">
        <div className="mb-6 flex items-center">
          <h1 className="text-2xl font-bold mr-4">Prospectos</h1>
          <Button size="sm" onClick={() => navigate('/applications/new')}><Plus className="mr-2 h-4 w-4" /> Nuevo Prospecto</Button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Buscar prospecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
        </div>

        {/* Prospects List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredProspects.map(prospect => (
            <Card key={prospect.id} className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {prospect.name}
                  <Badge variant="secondary">{prospect.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground grid gap-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {prospect.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {prospect.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Último contacto: {prospect.lastContact}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Prospects;
