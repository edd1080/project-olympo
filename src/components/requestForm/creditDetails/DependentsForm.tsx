import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DependentsFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const DependentsForm: React.FC<DependentsFormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      {/* Subtitle */}
      <h3 className="text-subtitle text-secondary-foreground">Información de dependientes</h3>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dependientes Económicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Has dependents checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasDependents"
              checked={formData.hasDependents || false}
              onCheckedChange={(checked) => updateFormData('hasDependents', checked)}
            />
            <Label htmlFor="hasDependents" className="text-sm font-medium">
              ¿Tiene dependientes económicos?
            </Label>
          </div>

          {/* Conditional dependent information */}
          {formData.hasDependents && (
            <div className="space-y-4 border-l-4 border-primary/20 pl-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalDependents" className="text-label">
                    Número total de dependientes *
                  </Label>
                  <Input
                    id="totalDependents"
                    type="number"
                    min="0"
                    max="20"
                    value={formData.totalDependents || ''}
                    onChange={(e) => updateFormData('totalDependents', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="studyingDependents" className="text-label">
                    Dependientes que estudian
                  </Label>
                  <Input
                    id="studyingDependents"
                    type="number"
                    min="0"
                    max={formData.totalDependents || 20}
                    value={formData.studyingDependents || ''}
                    onChange={(e) => updateFormData('studyingDependents', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Age ranges */}
              <div className="space-y-4">
                <h4 className="font-medium text-secondary-foreground">Distribución por edades</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dependents0to5" className="text-label text-sm">
                      0-5 años
                    </Label>
                    <Input
                      id="dependents0to5"
                      type="number"
                      min="0"
                      value={formData.dependents0to5 || ''}
                      onChange={(e) => updateFormData('dependents0to5', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dependents6to12" className="text-label text-sm">
                      6-12 años
                    </Label>
                    <Input
                      id="dependents6to12"
                      type="number"
                      min="0"
                      value={formData.dependents6to12 || ''}
                      onChange={(e) => updateFormData('dependents6to12', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dependents13to18" className="text-label text-sm">
                      13-18 años
                    </Label>
                    <Input
                      id="dependents13to18"
                      type="number"
                      min="0"
                      value={formData.dependents13to18 || ''}
                      onChange={(e) => updateFormData('dependents13to18', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dependentsOver18" className="text-label text-sm">
                      Mayores de 18 años
                    </Label>
                    <Input
                      id="dependentsOver18"
                      type="number"
                      min="0"
                      value={formData.dependentsOver18 || ''}
                      onChange={(e) => updateFormData('dependentsOver18', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Monthly expenses per dependent */}
              <div className="space-y-2">
                <Label htmlFor="monthlyExpensesPerDependent" className="text-label">
                  Gastos mensuales promedio por dependiente (Q)
                </Label>
                <Input
                  id="monthlyExpensesPerDependent"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.monthlyExpensesPerDependent || ''}
                  onChange={(e) => updateFormData('monthlyExpensesPerDependent', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {/* Show message when no dependents */}
          {!formData.hasDependents && (
            <div className="text-center text-muted-foreground p-4 bg-muted/20 rounded-md">
              <p className="text-sm">
                No tiene dependientes económicos registrados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DependentsForm;