import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA ,MatDialogRef} from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-mat-qr-code-dialog',
  templateUrl: './mat-qr-code-dialog.component.html',
  styleUrl: './mat-qr-code-dialog.component.css'
})
export class MatQrCodeDialogComponent {
  qrData = '';
  qrcodeDownloadLink:SafeUrl = "";
  productId = "";
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, public dialogRef:MatDialogRef<MatQrCodeDialogComponent>, private http: HttpClient, private sanitizer: DomSanitizer){
    
    this.qrData = data["qrString"];
    this.productId = data["productID"]+".png";
    console.log("QrString:"+this.qrData);
    console.log("ProductId:"+this.productId);
  }
  
  closeDialog(){
    this.dialogRef.close();
  }

  downloadImage(url:SafeUrl){
    this.qrcodeDownloadLink = url;
  }

  downloadQrCodeGenerated(event: MouseEvent){
    this.qrcodeDownloadLink = this.sanitizer.bypassSecurityTrustUrl(this.qrcodeDownloadLink.toString());
    const url: string = this.qrcodeDownloadLink.toString(); // Convert SafeUrl to regular URL
    console.log("URL:"+url)
    const anchor = event.target as HTMLAnchorElement;
    anchor.setAttribute('href', url);
    anchor.setAttribute('download', 'QrCode.png');
  }

}
