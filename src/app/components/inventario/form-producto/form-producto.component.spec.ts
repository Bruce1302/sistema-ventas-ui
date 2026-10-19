import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormProductoComponent } from './form-producto.component';

describe('FormProductoComponent', () => {
  let component: FormProductoComponent;
  let fixture: ComponentFixture<FormProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProductoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormProductoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
