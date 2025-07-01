
import { userFetchService } from './user/userFetchService';
import { userCreateService } from './user/userCreateService';
import { userUpdateService } from './user/userUpdateService';
import { userDeleteService } from './user/userDeleteService';
import { userEmailService } from './user/userEmailService';
import { userActivationService } from './user/userActivationService';

// Service principal qui agrège tous les services utilisateur
export const userService = {
  // Récupération des utilisateurs
  fetchUsers: userFetchService.fetchUsers,
  
  // Création d'utilisateur
  addUser: userCreateService.addUser,
  
  // Mise à jour d'utilisateur
  updateUser: userUpdateService.updateUser,
  
  // Suppression d'utilisateur
  deleteUser: userDeleteService.deleteUser,
  
  // Activation d'utilisateur
  activateUser: userActivationService.activateUser,
  
  // Gestion des emails
  confirmUserEmail: userEmailService.confirmUserEmail,
  resendConfirmationEmail: userEmailService.resendConfirmationEmail
};
