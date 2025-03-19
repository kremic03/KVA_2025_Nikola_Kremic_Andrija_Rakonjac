
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
<<<<<<< HEAD
    // provera da li je korisnik vec ulogovan
=======
   
>>>>>>> e50d56026fa0884a3adaa2b672a4187396d00f38
    if (UserService.getActiveUser()) {
      router.navigate(['/user'])
      return
    }
    
<<<<<<< HEAD
    // uzima povratnu adresu i vraca na login
=======
    
>>>>>>> e50d56026fa0884a3adaa2b672a4187396d00f38
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  public doLogin() {
    if (UserService.login(this.email, this.password)) {
<<<<<<< HEAD
      // preusmerava korisnika na povratnu adresu
=======
    
>>>>>>> e50d56026fa0884a3adaa2b672a4187396d00f38
      this.router.navigateByUrl(this.returnUrl);
      return;
    }

    alert('Invalid email or password');
  }
}
