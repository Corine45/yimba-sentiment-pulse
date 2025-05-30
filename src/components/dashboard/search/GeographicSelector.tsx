
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GeographicData {
  continents: {
    [key: string]: {
      name: string;
      countries: {
        [key: string]: {
          name: string;
          regions?: string[];
        };
      };
    };
  };
}

const geographicData: GeographicData = {
  continents: {
    africa: {
      name: "Afrique",
      countries: {
        ci: {
          name: "Côte d'Ivoire",
          regions: [
            "Abidjan",
            "Yamoussoukro",
            "Bouaké",
            "Daloa",
            "San-Pedro",
            "Korhogo",
            "Man",
            "Divo",
            "Gagnoa",
            "Abengourou"
          ]
        },
        ma: { name: "Maroc" },
        sn: { name: "Sénégal" },
        gh: { name: "Ghana" },
        ng: { name: "Nigeria" }
      }
    },
    europe: {
      name: "Europe",
      countries: {
        fr: { name: "France" },
        be: { name: "Belgique" },
        ch: { name: "Suisse" },
        de: { name: "Allemagne" },
        it: { name: "Italie" },
        es: { name: "Espagne" }
      }
    },
    america: {
      name: "Amérique",
      countries: {
        us: { name: "États-Unis" },
        ca: { name: "Canada" },
        br: { name: "Brésil" },
        mx: { name: "Mexique" }
      }
    },
    asia: {
      name: "Asie",
      countries: {
        cn: { name: "Chine" },
        jp: { name: "Japon" },
        in: { name: "Inde" },
        kr: { name: "Corée du Sud" }
      }
    }
  }
};

export const GeographicSelector = () => {
  const [selectedContinent, setSelectedContinent] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const handleContinentChange = (continent: string) => {
    setSelectedContinent(continent);
    setSelectedCountry("all");
    setSelectedRegion("all");
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedRegion("all");
  };

  const getAvailableCountries = () => {
    if (!selectedContinent || selectedContinent === "all") return [];
    return Object.entries(geographicData.continents[selectedContinent]?.countries || {});
  };

  const getAvailableRegions = () => {
    if (!selectedCountry || !selectedContinent || selectedCountry === "all" || selectedContinent === "all") return [];
    const country = geographicData.continents[selectedContinent]?.countries[selectedCountry];
    return country?.regions || [];
  };

  return (
    <div className="space-y-4">
      <Label>Localisation géographique</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sélection du continent */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Continent</Label>
          <Select value={selectedContinent} onValueChange={handleContinentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un continent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les continents</SelectItem>
              {Object.entries(geographicData.continents).map(([key, continent]) => (
                <SelectItem key={key} value={key}>
                  {continent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sélection du pays */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Pays</Label>
          <Select 
            value={selectedCountry} 
            onValueChange={handleCountryChange}
            disabled={!selectedContinent || selectedContinent === "all"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les pays</SelectItem>
              {getAvailableCountries().map(([key, country]) => (
                <SelectItem key={key} value={key}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sélection de la région (spécifique à la Côte d'Ivoire) */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">
            {selectedCountry === "ci" ? "Ville/Région" : "Région"}
          </Label>
          <Select 
            value={selectedRegion} 
            onValueChange={setSelectedRegion}
            disabled={!selectedCountry || selectedCountry === "all" || getAvailableRegions().length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une région" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les régions</SelectItem>
              {getAvailableRegions().map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Affichage de la sélection actuelle */}
      {(selectedContinent !== "all" || selectedCountry !== "all" || selectedRegion !== "all") && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700">
            <span className="font-medium">Sélection actuelle: </span>
            {selectedContinent !== "all" && geographicData.continents[selectedContinent]?.name}
            {selectedCountry !== "all" && ` > ${geographicData.continents[selectedContinent]?.countries[selectedCountry]?.name}`}
            {selectedRegion !== "all" && ` > ${selectedRegion}`}
          </div>
        </div>
      )}
    </div>
  );
};
