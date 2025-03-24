import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseConfigService } from '../../services/firebase-config.service';
import { ProductChainModel } from '../../models/ProductChainModel';
import { ProductOperationsModel } from '../../models/ProductOperationsModel';

@Component({
  selector: 'app-update-page',
  templateUrl: './update-page.component.html',
  styleUrl: './update-page.component.css'
})
export class UpdatePageComponent {
  productId :string | null = null;
  productDataList: ProductChainModel[]=[];
  isLoading: boolean = true;  
  productOperations:ProductOperationsModel[]=[];
  nonce:string | null = null;
  constructor(private route: ActivatedRoute,public firebaseConfigService:FirebaseConfigService) { }
  ngOnInit(): void {
    
    this.route.queryParamMap.subscribe(params => {
      // Fetch query parameters from paramMap
      this.productId = params.get('productId');
      this.nonce = params.get('nonce');
      console.log("")

      console.log('productId:', this.productId);
      console.log('nonce:', this.nonce);
      
      this.getDataOfProductNew(this.productId);
      this.getProductOperations(this.nonce);
      
    });
  }

  getDataOfProductNew(productId:string | null){
    this.firebaseConfigService.getProductById(this.productId??"-1").subscribe(
      (actionArray: any[]) =>{
        console.log(actionArray);
        this.productDataList = actionArray.map((item: any) =>{
          var recvdData = JSON.parse(JSON.stringify(item,this.firebaseConfigService.getCircularReplacer() ));
          //console.log("Item:"+JSON.stringify(item,this.firebaseConfigService.getCircularReplacer() ));
          this.nonce = recvdData['nonce'];

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
    
   
    setTimeout(() => {
      this.isLoading = false;  
    }, 500); 
  }

  // async getDataOfProduct(productId:string | null ) {
  //   if(productId == null){
  //     console.log("ProductID Invalid")
  //   }
  //   else{
  //     console.log("Working on prooductID :"+productId)
  //     const productData = await this.firebaseConfigService.getProductById(productId);
  //     if(productData){
  //       var recvdData = JSON.parse(JSON.stringify(productData,this.firebaseConfigService.getCircularReplacer() ));
  //       this.productData = new ProductChainModel(
  //         recvdData['nonce'],
  //         recvdData['productTitle'],
  //         recvdData['productId'],
  //         recvdData['operationText'],
  //         recvdData['prevHash'],
  //         recvdData['hash'],
  //         recvdData['timeStamp'],
  //         recvdData['qrString'],
  //         recvdData['scanCount'],
  //       );
  //     }
  //     else{
  //       console.log("Product Data not found")

  //     }  
      
  //   }
  //   setTimeout(() => {
  //     this.isLoading = false;  
  //    }, 500); 
    
  // }

  getProductOperations(productId:string | null){
    this.firebaseConfigService.getOperationsById(this.nonce??"-1").subscribe(
      
      (actionArray: any[]) =>{
        //console.log(actionArray)
        this.productOperations = actionArray.map((item: any) =>{
          var recvDocData = JSON.parse(JSON.stringify(item,this.firebaseConfigService.getCircularReplacer() ));
          //console.log("Item:"+JSON.stringify(item,this.firebaseConfigService.getCircularReplacer() ));
          return new ProductOperationsModel(
            recvDocData["operation"],
            recvDocData["prevHash"],
            recvDocData["currentHash"],
            recvDocData["timeStamp"],
            recvDocData["transID"])
            }
          );
      }
    );
  }

}
