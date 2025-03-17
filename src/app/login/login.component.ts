// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public email: string = '';
  public password: string = '';
  public returnUrl: string = '/';

  constructor(private router: Router, private route: ActivatedRoute) {
    // Check if user is already logged in
    if (UserService.getActiveUser()) {
      router.navigate(['/user'])
      return
    }
    
    // Get return URL from route parameters or default to '/'
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  public doLogin() {
    if (UserService.login(this.email, this.password)) {
      // Redirect user to return URL or profile
      this.router.navigateByUrl(this.returnUrl);
      return;
    }

    alert('Invalid email or password');
  }
}
