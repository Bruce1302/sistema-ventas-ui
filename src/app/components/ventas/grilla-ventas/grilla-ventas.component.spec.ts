import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrillaVentasComponent } from './grilla-ventas.component';

describe('GrillaVentasComponent', () => {
  let component: GrillaVentasComponent;
  let fixture: ComponentFixture<GrillaVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrillaVentasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrillaVentasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
