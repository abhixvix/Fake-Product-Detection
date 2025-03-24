import { Component } from '@angular/core';
import { FirebaseConfigService } from '../../services/firebase-config.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-product-form',
  templateUrl: './add-product-form.component.html',
  styleUrl: './add-product-form.component.css'
})
export class AddProductFormComponent {
 
  productTitle:string ="";
  productId:number =0;
  productModelNo:string ="";
  operationText:string ="New Product added by Admin";
  
  constructor(private firebaseConfig:FirebaseConfigService){

  }

  async onSubmit(){
    // console.log("tit:"+this.schemeTitle)
    // console.log("amt:"+this.schemeFund)
    // console.log("desc:"+this.schemeDescription)
    // console.log("apTyp:"+this.applicantType)
    // console.log("adhc:"+this.adharCard)
    // console.log("panc:"+this.pancard)
    // console.log("land:"+this.landDocument)
  
    await this.firebaseConfig.getDataFromFirestore().then(async ({ prevHash, nonce }) => {
      let isIdAvailable = await this.firebaseConfig.isProdcutIdAvailable(this.productId.toString());
      
      if(isIdAvailable){
        console.log('prevHash:', prevHash);
        console.log('nonce:', nonce);
        let timeStamp = this.firebaseConfig.getCurrentDate();
        let uuid = uuidv4();
        let qrString = this.productId+"|"+this.productModelNo+"|"+uuid;  
        console.log('uuid:', uuid);
        let currentHash = this.firebaseConfig.computeHash(nonce,prevHash,timeStamp,this.operationText,uuid,this.productModelNo,this.productId.toString())
  
        let dataMap = {
          "nonce":nonce,
          "prevHash":prevHash,
          "productTitle":this.productTitle,
          "productId":this.productId,
          "productModelNo":this.productModelNo,
          "operationText":this.operationText,
          "scanCount":0,
          "timeStamp":timeStamp,
          "hash":currentHash,
          "updateActions":[
            {"0":this.operationText}
          ],
          "scanRecords":[],
          "registeredby":"NA",
          "uuid":uuid,
          "qrString":qrString
        };
        console.log("Data Map :"+JSON.stringify(dataMap));
        let updateMap = {
          "id": "1",
          "timeStamp": timeStamp,
          "operation": this.operationText,
          "transID": "TRS1/"+this.productId,
          "currentHash": prevHash,
          "prevHash": "#1"
        };
        await this.firebaseConfig.addDataToProductChain(dataMap,updateMap);

      }
      else{
        console.log("Product ID not available, Already used.");
        window.alert("Product ID not available, Already used.");
      }

      
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  
  }
  

  printAllProductsAsJson(): void {
    this.firebaseConfig.getAllProducts().subscribe(products => {
      console.log(JSON.stringify(products));
    });
  }
  
}
