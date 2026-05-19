import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  // Estados del submit
  submitting = signal(false);
  submitError = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['', [
      Validators.required, 
      Validators.email
    ]],
    password: ['', [
      Validators.required, 
      Validators.minLength(4)
    ]]
  });

  control(name: string): AbstractControl {
    return this.loginForm.controls[name];
  }

  showError(name: string): boolean {
    const c = this.control(name);
    return c.invalid && c.touched;
  }

  errorMessage(name: string): string {
    const c = this.control(name);
    if (c.errors?.['required']) return 'Este campo es obligatorio.';
    if (c.errors?.['email']) return 'Formato de email inválido.';
    if (c.errors?.['minlength']) return 'La contraseña debe tener al menos 4 caracteres.';
    return '';
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    const data = this.loginForm.getRawValue();

    this.authService.login(data).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/trials']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.submitError.set(err.message || 'Error desconocido');
      }
    });
  }
}
