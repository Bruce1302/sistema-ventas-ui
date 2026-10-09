import { inject, Injectable, OnInit, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Categoria
{
  id: number;
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


}
