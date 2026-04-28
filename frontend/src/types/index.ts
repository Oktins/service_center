

export const Role = {
  CLIENT: 'CLIENT',
  MASTER: 'MASTER',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
} as const;
export type Role = typeof Role[keyof typeof Role];

export const RequestStatus = {
  NEW: 'NEW',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];

export const Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;
export type Priority = typeof Priority[keyof typeof Priority];

export const DispatchStatus = {
  SCHEDULED: 'SCHEDULED',
  EN_ROUTE: 'EN_ROUTE',
  ARRIVED: 'ARRIVED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type DispatchStatus = typeof DispatchStatus[keyof typeof DispatchStatus];

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  subCategories?: Category[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface ServiceCatalog {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  category: Category;
  imageUrl: string | null;
  isActive: boolean;
}

export interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  address: string;
  status: RequestStatus;
  priority: Priority;
  equipmentTypeName: string;
  clientName: string;
  masterName: string | null;
  estimatedCost: number | null;
  finalCost: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Master {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  isAvailable: boolean;
}

export interface SparePart {
  id: number;
  name: string;
  article: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  minQuantity: number;
  lowStock: boolean;
}

export interface SparePartUsage {
  id: number;
  serviceRequestId: number;
  sparePartId: number;
  sparePartName: string;
  quantity: number;
  pricePerUnit: number;
  createdAt: string;
}

export interface Review {
  id: number;
  serviceRequestId: number;
  clientName: string;
  masterName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface News {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  isPromotion: boolean;
  createdAt: string;
  expiresAt: string | null;
}

export interface EquipmentType {
  id: number;
  name: string;
  description: string;
}

export interface Statistics {
  totalRequests: number;
  newRequests: number;
  assignedRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  cancelledRequests: number;
  availableMasters: number;
  totalSpareParts: number;
  totalRevenue: number;
  categoryStats: { name: string; count: number }[];
}

export interface CostCalculation {
  calculatedCost: number;
  priority: string;
  strategy: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ServiceRequestCreate {
  title: string;
  description: string;
  equipmentTypeId: number;
  address: string;
  priority: Priority;
}

export interface ServiceCatalogCreate {
  name: string;
  description: string;
  basePrice: number;
  categoryId: number;
  imageUrl: string;
  isActive: boolean;
}

export interface NewsCreate {
  title: string;
  content: string;
  imageUrl: string;
  isPromotion: boolean;
  expiresAt: string | null;
}

export interface SparePartCreate {
  name: string;
  article: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  minQuantity: number;
}

export interface SparePartUsageCreate {
  sparePartId: number;
  quantity: number;
}

export interface ReviewCreate {
  serviceRequestId: number;
  rating: number;
  comment: string;
}

export interface UpdateUserRole {
  role: Role;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

export interface CreateMasterProfileRequest {
  userId: number;
  specialization: string;
  experienceYears: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const STATUS_LABELS: Record<RequestStatus, string> = {
  [RequestStatus.NEW]: 'Новая',
  [RequestStatus.ASSIGNED]: 'Назначена',
  [RequestStatus.IN_PROGRESS]: 'В работе',
  [RequestStatus.COMPLETED]: 'Завершена',
  [RequestStatus.CANCELLED]: 'Отменена',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  [Priority.LOW]: 'Низкий',
  [Priority.MEDIUM]: 'Средний',
  [Priority.HIGH]: 'Высокий',
  [Priority.URGENT]: 'Срочный',
};

export const ROLE_LABELS: Record<Role, string> = {
  [Role.CLIENT]: 'Клиент',
  [Role.MASTER]: 'Мастер',
  [Role.MANAGER]: 'Менеджер',
  [Role.ADMIN]: 'Администратор',
};
