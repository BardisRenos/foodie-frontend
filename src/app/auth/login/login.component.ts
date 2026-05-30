import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth';
import { LanguageService } from '../../core/services/language';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  role: 'consumer' | 'farmer' = 'consumer';
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public languageService: LanguageService
  ) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  setRole(role: 'consumer' | 'farmer'): void {
    this.role = role;
    this.errorMessage = '';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  switchLanguage(lang: string): void {
    this.languageService.switchLanguage(lang);
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) return;
    this.loading = true;
    this.errorMessage = '';

    const request = this.loginForm.value;
    const login$ = this.role === 'farmer'
      ? this.authService.loginFarmer(request)
      : this.authService.loginUser(request);

    login$.subscribe({
      next: (response) => {
        this.loading = false;
        if (response.role === 'FARMER') {
          this.router.navigate(['/farmer/dashboard']);
        } else if (response.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/marketplace']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'login.invalid_credentials';
      }
    });
  }
}