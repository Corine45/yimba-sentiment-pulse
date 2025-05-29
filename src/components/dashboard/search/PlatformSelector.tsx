
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const PlatformSelector = () => {
  return (
    <div className="space-y-3">
      <Label>Plateformes sociales</Label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { id: "twitter", label: "Twitter/X" },
          { id: "facebook", label: "Facebook" },
          { id: "instagram", label: "Instagram" },
          { id: "tiktok", label: "TikTok" },
          { id: "youtube", label: "YouTube" }
        ].map((platform) => (
          <div key={platform.id} className="flex items-center space-x-2">
            <Checkbox id={platform.id} defaultChecked />
            <Label htmlFor={platform.id} className="text-sm">
              {platform.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
