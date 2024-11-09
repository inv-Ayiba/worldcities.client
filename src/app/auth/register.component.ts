import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { RegisterRequest } from './register-request';
import { RegisterResult } from './register-result';
import { Router } from '@angular/router';
import { AbstractControl } from '@angular/forms';

function passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  registerResult?: RegisterResult;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator }
  );
  }

  onSubmit() {
    const registerRequest: RegisterRequest = {
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
      confirmPassword: this.form.controls['confirmPassword'].value,
    };

    this.authService.register(registerRequest).subscribe({
      next: (result) => {
        this.registerResult = result;
        if (result.success) {
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.log(error);
        this.registerResult = error.error;
      },
    });
  }
}


// import { ActivatedRoute, Router } from '@angular/router';
// import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';

// import { BaseFormComponent } from '../base-form.component';
// import { AuthService } from './auth.service';
// import { LoginRequest } from './login-request';
// import { LoginResult } from './login-result';

// import { Component } from '@angular/core';
// import { RegisterRequest } from './register-request';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.scss']
// })
// export class RegisterComponent {
//   registerData: RegisterRequest = { email: '', password: '' };

//   constructor(private authService: AuthService) { }

//   onRegister() {
//     this.authService.register(this.registerData).subscribe(
//       response => {
//         alert(response.message); // Registration successful
//       },
//       error => {
//         alert('Registration failed'); // Handle error case
//       }
//     );
//   }
// }
