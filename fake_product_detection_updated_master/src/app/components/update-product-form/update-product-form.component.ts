import { Component, Input } from '@angular/core';
import { FirebaseConfigService } from '../../services/firebase-config.service';

@Component({
  selector: 'app-update-product-form',
  templateUrl: './update-product-form.component.html',
  styleUrl: './update-product-form.component.css'
})
export class UpdateProductFormComponent {
  @Input() productId:string | null = null;
  @Input() nonce:string | null = null;
  operationText:string ="Operation ....";
   
  constructor(private firebaseConfig:FirebaseConfigService){}

  async onSubmit(){
    await this.firebaseConfig.updateOperation(this.operationText,this.nonce,this.productId);
  }

}
