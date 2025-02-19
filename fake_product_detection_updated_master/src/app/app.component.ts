import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseConfigService } from './services/firebase-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fake_product_detection_updated';


  constructor(private route: ActivatedRoute,private router: Router,public firebaseConfigService:FirebaseConfigService){
    this.router.navigate(['/loginPage'], { relativeTo: this.route });
  }
}
