import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrillaUsuariosComponent } from './grilla-usuarios.component';

describe('GrillaUsuariosComponent', () => {
  let component: GrillaUsuariosComponent;
  let fixture: ComponentFixture<GrillaUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrillaUsuariosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrillaUsuariosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
