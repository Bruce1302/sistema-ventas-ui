import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrillaHeaderComponent } from './grilla-header.component';

describe('GrillaHeaderComponent', () => {
  let component: GrillaHeaderComponent;
  let fixture: ComponentFixture<GrillaHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrillaHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrillaHeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
