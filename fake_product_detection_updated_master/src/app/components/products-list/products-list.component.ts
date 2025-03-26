import { Component, ComponentFactoryResolver } from '@angular/core';
import { ProductChainModel } from '../../models/ProductChainModel';
import { FirebaseConfigService } from '../../services/firebase-config.service';
import { QRCodeComponent } from 'angularx-qrcode';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../../services/dialog.service';
import { MatQrCodeDialogComponent } from '../mat-qr-code-dialog/mat-qr-code-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent {
  
  constructor(public firebaseConfigService:FirebaseConfigService,private dialogService: DialogService,private route: ActivatedRoute,private router: Router){
    this.getMasterChainList();
 }
  productsChainList:ProductChainModel[]=[];
  qrData: string = 'Hello, world!';

  getMasterChainList(){
    this.firebaseConfigService.getProductBlockChainList().subscribe(
      (actionArray: any[]) =>{
        this.productsChainList = actionArray.map((item: any) =>{
          var recvdData = JSON.parse(JSON.stringify(item,this.firebaseConfigService.getCircularReplacer() ));
          console.log("Item:"+JSON.stringify(item,this.firebaseConfigService.getCircularReplacer() ));
          return new ProductChainModel(
            recvdData['nonce'],
            recvdData['productTitle'],
            recvdData['productId'],
            recvdData['operationText'],
            recvdData['prevHash'],
            recvdData['hash'],
            recvdData['timeStamp'],
            recvdData['qrString'],
            recvdData['scanCount'],
          )
            }
          );
      }
    );
  }
  
  showQrCode(qrString:string,productID:string):void{
    console.log("Showing QR CODE DIalog")
    this.dialogService.openQrCodeDialog(qrString,productID);

  }

  updateProductDetails(productId:string,nonce:number){
    this.router.navigate(['/updatePage'], { queryParams: { productId: productId ,nonce:nonce.toString()} });
  }
}
