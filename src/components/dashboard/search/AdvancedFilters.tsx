
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { CalendarIcon, X, Filter } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const AdvancedFilters = () => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'Anglais' },
    { code: 'es', name: 'Espagnol' },
    { code: 'de', name: 'Allemand' },
    { code: 'it', name: 'Italien' }
  ];

  const countries = [
    { code: 'FR', name: 'France' },
    { code: 'BE', name: 'Belgique' },
    { code: 'CH', name: 'Suisse' },
    { code: 'CA', name: 'Canada' },
    { code: 'US', name: 'États-Unis' }
  ];

  const addLanguage = (language: string) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const removeLanguage = (language: string) => {
    setSelectedLanguages(selectedLanguages.filter(l => l !== language));
  };

  const addCountry = (country: string) => {
    if (!selectedCountries.includes(country)) {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const removeCountry = (country: string) => {
    setSelectedCountries(selectedCountries.filter(c => c !== country));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtres avancés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Période */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Période</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-gray-600">Date de début</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP", { locale: fr }) : "Sélectionner..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-600">Date de fin</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP", { locale: fr }) : "Sélectionner..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Sentiment */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sentiment</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tous les sentiments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les sentiments</SelectItem>
              <SelectItem value="positive">Positif uniquement</SelectItem>
              <SelectItem value="negative">Négatif uniquement</SelectItem>
              <SelectItem value="neutral">Neutre uniquement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Engagement minimum */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">J'aime min.</label>
            <Input type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Commentaires min.</label>
            <Input type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Partages min.</label>
            <Input type="number" placeholder="0" />
          </div>
        </div>

        {/* Langues */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Langues</label>
          <Select onValueChange={addLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Ajouter une langue" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2">
            {selectedLanguages.map((langCode) => {
              const lang = languages.find(l => l.code === langCode);
              return (
                <Badge key={langCode} variant="secondary" className="flex items-center gap-1">
                  {lang?.name}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeLanguage(langCode)}
                  />
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Pays */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Pays/Régions</label>
          <Select onValueChange={addCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Ajouter un pays" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2">
            {selectedCountries.map((countryCode) => {
              const country = countries.find(c => c.code === countryCode);
              return (
                <Badge key={countryCode} variant="secondary" className="flex items-center gap-1">
                  {country?.name}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeCountry(countryCode)}
                  />
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Type de contenu */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Type de contenu</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="text">Texte uniquement</SelectItem>
              <SelectItem value="image">Avec images</SelectItem>
              <SelectItem value="video">Avec vidéos</SelectItem>
              <SelectItem value="link">Avec liens</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Boutons d'action */}
        <div className="flex space-x-2 pt-4">
          <Button variant="outline" className="flex-1">
            Réinitialiser
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600">
            Appliquer les filtres
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
