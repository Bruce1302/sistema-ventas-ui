import { Component, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { VentaResponse } from '../../services/venta.service';
import { Tienda } from '../../services/tienda.service';

@Component({
  imports: [ DatePipe, DecimalPipe, ],
  selector: 'app-ticket-interno',
  styleUrl: './ticket-interno.component.css',
  templateUrl: './ticket-interno.component.html',
})
export class TicketInternoComponent {

  venta = input<VentaResponse | null>(null);
  tienda = input<Tienda | null>(null);

}
