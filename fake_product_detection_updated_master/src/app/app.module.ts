import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddProductFormComponent } from './components/add-product-form/add-product-form.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { AdminHomePageComponent } from './pages/admin-home-page/admin-home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { MatDialogModule } from '@angular/material/dialog';
import { MatQrCodeDialogComponent } from './components/mat-qr-code-dialog/mat-qr-code-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { UpdatePageComponent } from './pages/update-page/update-page.component';
import { UpdateProductFormComponent } from './components/update-product-form/update-product-form.component';

const firebaseConfig = {
  apiKey: "AIzaSyCQkewRwGMMSU3Z1iAjBkFu4oieFcMHdqI",
  authDomain: "fakeproductdetec.firebaseapp.com",
  projectId: "fakeproductdetec",
  storageBucket: "fakeproductdetec.appspot.com",
  messagingSenderId: "734670126258",
  appId: "1:734670126258:web:4fa7346ef0b9728fc09dab"
};

@NgModule({
  declarations: [
    AppComponent,
    AddProductFormComponent,
    ProductsListComponent,
    AdminHomePageComponent,
    LoginPageComponent,
    MatQrCodeDialogComponent,
    UpdatePageComponent,
    UpdateProductFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    FormsModule,
    QRCodeModule,
    MatDialogModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
