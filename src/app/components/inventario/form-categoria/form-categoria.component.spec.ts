import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCategoriaComponent } from './form-categoria.component';

describe('FormCategoriaComponent', () => {
  let component: FormCategoriaComponent;
  let fixture: ComponentFixture<FormCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCategoriaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormCategoriaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
