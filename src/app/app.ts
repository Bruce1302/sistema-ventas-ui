import { Component, signal } from '@angular/core';
import {Login} from './components/login/login';

//import { RouterOutlet } from '@angular/router';

@Component({
  //imports: [RouterOutlet],
  selector: 'app-root',
  standalone: true,
  imports: [Login],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('sistema-ventas-ui');
}
