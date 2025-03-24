import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})

export class LoginPageComponent {
  email:string = "";
  password:string = "";

  constructor(private readonly router: Router,private route: ActivatedRoute){

  }
  
  async login() {
    console.log("E:"+this.email)
    console.log("P:"+this.password)
    sessionStorage.clear();
    if(this.email == "admin@fpd" && this.password == "admin"){
      window.alert("Admin Logged in Successfully!");
      sessionStorage.setItem('user', "admin@fds");
      this.router.navigate(['/adminHomePage'],{relativeTo: this.route});
    }
    else{
      window.alert("Invalid Admin credentials");
    }  
  }


}
