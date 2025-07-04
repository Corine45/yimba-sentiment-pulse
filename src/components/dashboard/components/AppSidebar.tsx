import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Search,
  Settings,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { SidebarClose } from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: any;
  permissions: any;
}

const navigationItems = [
  {
    title: "Tableau de bord",
    url: "/dashboard",
    icon: Home,
    description: "Vue d'ensemble de votre activité"
  },
  {
    title: "Recherche",
    url: "/dashboard/search",
    icon: Search,
    description: "Effectuer une nouvelle recherche"
  },
  {
    title: "Recherche Avancée",
    url: "/recherche2",
    icon: Search,
    description: "Recherche API Backend style Brand24"
  },
  {
    title: "Paramètres",
    url: "/dashboard/settings",
    icon: Settings,
    description: "Gérer votre compte et préférences"
  },
  {
    title: "Abonnement",
    url: "/dashboard/subscription",
    icon: CreditCard,
    description: "Consulter et gérer votre abonnement"
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: Bell,
    description: "Consulter vos dernières notifications"
  },
  {
    title: "Aide & Support",
    url: "/dashboard/help",
    icon: HelpCircle,
    description: "Obtenir de l'aide et du support"
  }
];

export const AppSidebar = ({ activeTab, onTabChange, user, permissions }: AppSidebarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <SidebarClose />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64">
        <SheetHeader className="text-left">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Explorez les différentes sections de votre tableau de bord.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="my-4">
          <div className="flex flex-col space-y-1">
            {navigationItems.map((item) => (
              <Link to={item.url} key={item.title}>
                <Button
                  variant="ghost"
                  className="justify-start px-4"
                  onClick={() => {
                    onTabChange(item.url.split("/").pop() || "dashboard");
                    setOpen(false);
                  }}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </Button>
              </Link>
            ))}
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-2">
            <div className="px-4 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.imageUrl} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-2 text-sm font-medium">{user.name}</div>
              <div className="ml-2 text-xs text-gray-500">{user.email}</div>
            </div>
            <Button variant="outline" className="justify-start px-4">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
