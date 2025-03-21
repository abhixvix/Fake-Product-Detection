import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomePageComponent } from './pages/admin-home-page/admin-home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { UpdatePageComponent } from './pages/update-page/update-page.component';

const routes: Routes = [
  { path: 'adminHomePage', component: AdminHomePageComponent },
  { path: 'loginPage', component: LoginPageComponent },
  { path: 'updatePage', component: UpdatePageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
