
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface HealthAlert {
  id: string;
  disease: string;
  location: string;
  severity: 'faible' | 'modéré' | 'critique';
  timestamp: string;
  source: string;
}

interface HealthMapProps {
  alerts: HealthAlert[];
}

export const HealthMap = ({ alerts }: HealthMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // Coordonnées simplifiées des principales villes de Côte d'Ivoire
  const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    "Abidjan": { lat: 5.3364, lng: -4.0267 },
    "Bouaké": { lat: 7.6938, lng: -5.0303 },
    "Korhogo": { lat: 9.4580, lng: -5.6294 },
    "San Pedro": { lat: 4.7469, lng: -6.6363 },
    "Yamoussoukro": { lat: 6.8205, lng: -5.2767 }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critique': return '#dc2626';
      case 'modéré': return '#d97706';
      case 'faible': return '#16a34a';
      default: return '#6b7280';
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Simulation d'une carte interactive simple avec SVG
    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';

    // Créer un SVG simple représentant la Côte d'Ivoire
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "300");
    svg.setAttribute("viewBox", "0 0 400 300");
    svg.style.background = "#f8fafc";
    svg.style.border = "1px solid #e2e8f0";
    svg.style.borderRadius = "8px";

    // Contour simplifié de la Côte d'Ivoire
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M50,50 L350,50 L350,200 L200,250 L50,200 Z");
    path.setAttribute("fill", "#e0f2fe");
    path.setAttribute("stroke", "#0369a1");
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);

    // Ajouter les villes et alertes
    Object.entries(cityCoordinates).forEach(([city, coords]) => {
      const cityAlerts = alerts.filter(alert => alert.location.includes(city));
      
      // Position approximative sur notre SVG simplifié
      const x = ((coords.lng + 8) / 4) * 400;
      const y = ((10 - coords.lat) / 6) * 300;

      // Point de la ville
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x.toString());
      circle.setAttribute("cy", y.toString());
      circle.setAttribute("r", cityAlerts.length > 0 ? "8" : "4");
      circle.setAttribute("fill", cityAlerts.length > 0 ? getSeverityColor(cityAlerts[0].severity) : "#64748b");
      circle.setAttribute("stroke", "#ffffff");
      circle.setAttribute("stroke-width", "2");
      circle.style.cursor = "pointer";

      // Titre avec info au survol
      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = `${city}: ${cityAlerts.length} alerte(s)`;
      circle.appendChild(title);

      svg.appendChild(circle);

      // Label de la ville
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", (x + 12).toString());
      text.setAttribute("y", (y + 4).toString());
      text.setAttribute("font-size", "12");
      text.setAttribute("font-weight", "500");
      text.setAttribute("fill", "#374151");
      text.textContent = city;
      svg.appendChild(text);
    });

    mapContainer.appendChild(svg);
  }, [alerts]);

  return (
    <div className="space-y-4">
      <div ref={mapRef} className="w-full" />
      
      {/* Légende */}
      <div className="flex items-center justify-center space-x-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
          <span>Critique</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
          <span>Modéré</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
          <span>Faible</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <span>Aucune alerte</span>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500">
        Carte interactive - Côte d'Ivoire
      </div>
    </div>
  );
};
