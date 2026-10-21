import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrillaCategoriasComponent } from './grilla-categorias.component';

describe('GrillaCategoriasComponent', () => {
  let component: GrillaCategoriasComponent;
  let fixture: ComponentFixture<GrillaCategoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrillaCategoriasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrillaCategoriasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
