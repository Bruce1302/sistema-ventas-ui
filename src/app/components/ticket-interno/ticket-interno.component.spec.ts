import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketInternoComponent } from './ticket-interno.component';

describe('TicketInternoComponent', () => {
  let component: TicketInternoComponent;
  let fixture: ComponentFixture<TicketInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketInternoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketInternoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
