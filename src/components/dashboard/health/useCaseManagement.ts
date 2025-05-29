
import { useState } from "react";

export const useCaseManagement = () => {
  const [cases, setCases] = useState([
    {
      id: "CASE001",
      alertId: "HS001",
      disease: "COVID-19",
      location: "Abidjan, Cocody",
      status: "en_cours",
      assignedTo: "Dr. Kouassi",
      createdAt: "2024-01-15",
      priority: "haute",
      actions: 3,
      description: "Signalement de plusieurs cas de symptômes respiratoires dans le quartier de Riviera. Investigation en cours."
    },
    {
      id: "CASE002",
      alertId: "HS002",
      disease: "Paludisme",
      location: "Bouaké",
      status: "nouveau",
      assignedTo: null,
      createdAt: "2024-01-15",
      priority: "critique",
      actions: 0,
      description: "Augmentation significative des cas de paludisme dans plusieurs quartiers de Bouaké."
    },
    {
      id: "CASE003",
      alertId: "",
      disease: "Rougeole",
      location: "Korhogo",
      status: "resolu",
      assignedTo: "Dr. Diabaté",
      createdAt: "2024-01-10",
      priority: "normale",
      actions: 8,
      description: "Épidémie de rougeole dans une école primaire. Campagne de vaccination réalisée."
    }
  ]);

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  // Dialogues
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Filtrage des cas
  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || caseItem.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || caseItem.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === "all" || 
                           (assigneeFilter === "unassigned" && !caseItem.assignedTo) ||
                           caseItem.assignedTo === assigneeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const handleCreateCase = (newCase: any) => {
    setCases(prev => [newCase, ...prev]);
  };

  const handleUpdateCase = (updatedCase: any) => {
    setCases(prev => prev.map(caseItem => 
      caseItem.id === updatedCase.id ? updatedCase : caseItem
    ));
  };

  const handleViewDetails = (caseItem: any) => {
    setSelectedCase(caseItem);
    setDetailsOpen(true);
  };

  const handleAssignCase = (caseId: string, assignee: string) => {
    setCases(prev => prev.map(caseItem => 
      caseItem.id === caseId 
        ? { ...caseItem, assignedTo: assignee === "unassigned" ? null : assignee, status: assignee !== "unassigned" ? "en_cours" : caseItem.status }
        : caseItem
    ));
  };

  return {
    cases,
    filteredCases,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    selectedCase,
    detailsOpen,
    setDetailsOpen,
    handleCreateCase,
    handleUpdateCase,
    handleViewDetails,
    handleAssignCase
  };
};
