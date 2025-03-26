import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatQrCodeDialogComponent } from './mat-qr-code-dialog.component';

describe('MatQrCodeDialogComponent', () => {
  let component: MatQrCodeDialogComponent;
  let fixture: ComponentFixture<MatQrCodeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatQrCodeDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatQrCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
