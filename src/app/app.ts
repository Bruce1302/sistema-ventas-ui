import { Component, signal } from '@angular/core';
import { LoginComponent } from './components/login/login.component';


//import { RouterOutlet } from '@angular/router';

@Component({
  //imports: [RouterOutlet],
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('sistema-ventas-ui');
}
