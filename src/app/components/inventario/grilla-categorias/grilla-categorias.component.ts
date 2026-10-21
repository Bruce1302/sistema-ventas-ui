import { Component, inject } from '@angular/core';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  imports: [],
  selector: 'app-grilla-categorias',
  styleUrl: './grilla-categorias.component.css',
  templateUrl: './grilla-categorias.component.html',
})
export class GrillaCategoriasComponent {

  private categoriaService = inject(CategoriaService);

  listaCategorias = this.categoriaService.categorias; //traemos las categorias

  eliminarCategoria(id: string)
  {
    this.categoriaService.eliminarCategoria(id);
  }


}
