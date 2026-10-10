export interface PageMetadata {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

// LaT recibe cualquier otra interfaz, o sea, cualquier objeto y la inyecta en el arreglo 'content'
export interface PageResponse<T> {
  content: T[];
  page: PageMetadata;
}
