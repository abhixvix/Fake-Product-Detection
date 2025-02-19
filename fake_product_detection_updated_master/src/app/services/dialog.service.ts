import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatQrCodeDialogComponent } from '../components/mat-qr-code-dialog/mat-qr-code-dialog.component';
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog:MatDialog) {} 

    openQrCodeDialog(qrString:string,productID:string): void{
      this.dialog.open(MatQrCodeDialogComponent,{
         width: '390px',
        disableClose:true,
        //panelClass: 'my-dialog-class'
        data:{
          "qrString":qrString,
          "productID":productID
        }
      })
    
    
  }
}
