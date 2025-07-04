
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GeographicLocation {
  country: string;
  region: string;
  city?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface GeographicAPIResponse {
  locations: GeographicLocation[];
  countries: string[];
  regions: Record<string, string[]>;
}

export const useGeographicAPI = () => {
  const [locations, setLocations] = useState<GeographicLocation[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [regions, setRegions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchGeographicData = async (query?: string) => {
    setLoading(true);
    try {
      // Simuler un appel API pour les données géographiques
      // En production, vous pouvez utiliser une vraie API géographique
      const mockData: GeographicAPIResponse = {
        locations: [
          { country: 'Côte d\'Ivoire', region: 'Abidjan', city: 'Abidjan', coordinates: { lat: 5.3600, lng: -4.0083 } },
          { country: 'Côte d\'Ivoire', region: 'Yamoussoukro', city: 'Yamoussoukro', coordinates: { lat: 6.8276, lng: -5.2893 } },
          { country: 'France', region: 'Île-de-France', city: 'Paris', coordinates: { lat: 48.8566, lng: 2.3522 } },
          { country: 'Sénégal', region: 'Dakar', city: 'Dakar', coordinates: { lat: 14.7167, lng: -17.4677 } },
          { country: 'Ghana', region: 'Greater Accra', city: 'Accra', coordinates: { lat: 5.6037, lng: -0.1870 } },
        ],
        countries: ['Côte d\'Ivoire', 'France', 'Sénégal', 'Ghana', 'Burkina Faso'],
        regions: {
          'Côte d\'Ivoire': ['Abidjan', 'Yamoussoukro', 'Bouaké', 'Daloa', 'San-Pedro'],
          'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes'],
          'Sénégal': ['Dakar', 'Thiès', 'Kaolack', 'Saint-Louis'],
          'Ghana': ['Greater Accra', 'Ashanti', 'Northern', 'Western'],
          'Burkina Faso': ['Centre', 'Hauts-Bassins', 'Centre-Ouest']
        }
      };

      // Filtrer par query si fournie
      const filteredData = query 
        ? {
            ...mockData,
            locations: mockData.locations.filter(loc => 
              loc.country.toLowerCase().includes(query.toLowerCase()) ||
              loc.region.toLowerCase().includes(query.toLowerCase()) ||
              (loc.city && loc.city.toLowerCase().includes(query.toLowerCase()))
            )
          }
        : mockData;

      setLocations(filteredData.locations);
      setCountries(filteredData.countries);
      setRegions(filteredData.regions);

      console.log('Données géographiques chargées:', filteredData);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données géographiques:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données géographiques",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRegionsForCountry = (country: string): string[] => {
    return regions[country] || [];
  };

  const searchLocationsByKeyword = async (keyword: string): Promise<GeographicLocation[]> => {
    setLoading(true);
    try {
      // En production, utiliser une vraie API de géocoding
      // comme Google Maps API, OpenStreetMap Nominatim, etc.
      const filtered = locations.filter(loc =>
        loc.country.toLowerCase().includes(keyword.toLowerCase()) ||
        loc.region.toLowerCase().includes(keyword.toLowerCase()) ||
        (loc.city && loc.city.toLowerCase().includes(keyword.toLowerCase()))
      );
      
      return filtered;
    } catch (error) {
      console.error('Erreur lors de la recherche géographique:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeographicData();
  }, []);

  return {
    locations,
    countries,
    regions,
    loading,
    fetchGeographicData,
    getRegionsForCountry,
    searchLocationsByKeyword,
  };
};
