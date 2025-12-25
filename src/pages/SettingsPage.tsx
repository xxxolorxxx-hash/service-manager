import { useState, useEffect } from 'react';
import { useSettings, useUpdateSettings } from '@/lib/hooks/useApp';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/lib/hooks/useToast';
import { useUIStore } from '@/lib/stores/uiStore';
import { Save, Database, Trash2, FileDown, FileUp } from 'lucide-react';
import { useCreateDemoData, useExportData, useImportData } from '@/lib/hooks/useApp';

export default function SettingsPage() {
  const { settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const createDemoData = useCreateDemoData();
  const exportData = useExportData();
  const importData = useImportData();
  const { toast } = useToast();
  const { setCurrentPage } = useUIStore();

  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    companyNip: '',
    companyPhone: '',
    companyEmail: '',
    defaultVatRate: 23,
    quoteValidDays: 30,
    currency: 'PLN',
    dateFormat: 'DD MMM YYYY',
  });

  useEffect(() => {
    setCurrentPage('settings');
  }, [setCurrentPage]);

  useEffect(() => {
    if (settings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        companyName: settings.companyName || '',
        companyAddress: settings.companyAddress || '',
        companyNip: settings.companyNip || '',
        companyPhone: settings.companyPhone || '',
        companyEmail: settings.companyEmail || '',
        defaultVatRate: settings.defaultVatRate || 23,
        quoteValidDays: settings.quoteValidDays || 30,
        currency: settings.currency || 'PLN',
        dateFormat: settings.dateFormat || 'DD MMM YYYY',
      });
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSettings(formData);
      toast({
        title: 'Sukces',
        description: 'Ustawienia zostały zapisane',
        variant: 'success',
      });
    } catch {
      toast({
        title: 'Błąd',
        description: 'Wystąpił błąd podczas zapisywania ustawień',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateDemoData = async () => {
    if (confirm('Czy na pewno chcesz wygenerować dane testowe? Spowoduje to dodanie przykładowych danych.')) {
      try {
        await createDemoData();
        toast({
          title: 'Sukces',
          description: 'Dane testowe zostały wygenerowane',
          variant: 'success',
        });
      } catch {
        toast({
          title: 'Błąd',
          description: 'Wystąpił błąd podczas generowania danych',
          variant: 'destructive',
        });
      }
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importData(file);
        toast({
          title: 'Sukces',
          description: 'Dane zostały zaimportowane',
          variant: 'success',
        });
      } catch {
        toast({
          title: 'Błąd',
          description: 'Wystąpił błąd podczas importu',
          variant: 'destructive',
        });
      }
    }
  };

  if (isLoading) {
    return <div className="p-4">Ładowanie...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ustawienia</h1>
        <p className="text-muted-foreground">Konfiguracja firmy i aplikacji</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dane firmy</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nazwa firmy</label>
              <Input
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Twoja Firma"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Adres</label>
              <Input
                value={formData.companyAddress}
                onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                placeholder="Warszawa, ul. Przykładowa 1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">NIP</label>
                <Input
                  value={formData.companyNip}
                  onChange={(e) => setFormData({ ...formData, companyNip: e.target.value })}
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Telefon</label>
                <Input
                  type="tel"
                  value={formData.companyPhone}
                  onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                  placeholder="+48 123 456 789"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.companyEmail}
                onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                placeholder="biuro@firma.pl"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Domyślny VAT (%)</label>
                <select
                  value={formData.defaultVatRate}
                  onChange={(e) => setFormData({ ...formData, defaultVatRate: parseFloat(e.target.value) })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="0">0%</option>
                  <option value="8">8%</option>
                  <option value="23">23%</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Waźność kosztorysu (dni)</label>
                <Input
                  type="number"
                  value={formData.quoteValidDays}
                  onChange={(e) => setFormData({ ...formData, quoteValidDays: parseInt(e.target.value) || 30 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Waluta</label>
                <Input
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Zapisz ustawienia
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zarządzanie danymi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              variant="outline"
              onClick={exportData}
              className="w-full"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Eksportuj dane (JSON)
            </Button>
            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-file')?.click()}
                className="w-full"
              >
                <FileUp className="mr-2 h-4 w-4" />
                Importuj dane (JSON)
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGenerateDemoData}
            className="w-full"
          >
            <Database className="mr-2 h-4 w-4" />
            Wygeneruj dane testowe
          </Button>

          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Czy na pewno chcesz usunąć WSZYSTKIE dane? Ta operacja jest nieodwracalna!')) {
                if (confirm('Na pewno? Wszystkie dane zostaną trwale usunięte!')) {
                  indexedDB.deleteDatabase('ServiceAppDB');
                  window.location.reload();
                }
              }
            }}
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Usuń wszystkie dane
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
