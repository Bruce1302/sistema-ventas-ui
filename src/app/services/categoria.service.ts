import { inject, Injectable, OnInit, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Categoria
{
  id: string;
  nombre: string;
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class CategoriaService
{
   categorias = signal(<Categoria[]>([]));

   private apiUrl = 'http://localhost:8080/categorias';

   private http = inject(HttpClient);

   obtenerCategorias()
   {
     this.http.get<Categoria[]>(this.apiUrl).subscribe({
       next: (categorias:Categoria[]) =>
       {
         this.categorias.set(categorias);
       }
     });
   }

   agregarCategorias(nombre: string)
   {
      return this.http.post<Categoria>(this.apiUrl, nombre);
   }

   eliminarCategoria(id: string)
   {
      return this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () =>
        {
          console.log('Categoria eliminada');
          this.categorias.update(categoriasActuales => categoriasActuales.filter(categoria => categoria.id !== id));
        },
        error: (error) =>
        {
          console.error('Error al eliminar categoria:', error);
        }
      })
   }


}
