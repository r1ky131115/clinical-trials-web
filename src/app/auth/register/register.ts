import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  submitting = signal(false);
  submitError = signal<string | null>(null);

  registerForm: FormGroup = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(4)
    ]],
    confirmPassword: ['', [
      Validators.required
    ]],
    fullName: ['', [
      Validators.required,
      Validators.minLength(4)
    ]]
  });

  control(name: string): AbstractControl {
    return this.registerForm.controls[name];
  };

  showError(name: string): boolean {
    const c = this.control(name);
    return c.invalid && c.touched;
  };

  errorMessage(name: string): string {
    const c = this.control(name);
    if (c.errors?.['required']) return 'Este campo es obligatorio.';
    if (c.errors?.['email']) return 'Formato de email inválido.';
    if (c.errors?.['minlength']) return 'La contraseña debe tener al menos 4 caracteres.';
    if (c.errors?.['serverError']) return c.errors['serverError'];
    return '';
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const data = this.registerForm.getRawValue();

    if (data.password !== data.confirmPassword) {
      this.submitError.set('Las contraseñas no coinciden.');
      return;
    }

    // Extraemos confirmPassword y guardamos el resto en 'rest'
    const { confirmPassword, ...registerData } = data;

    this.submitting.set(true);
    
    // Enviamos solo 'registerData', que contiene email, password y FullName
    this.authService.register(registerData).subscribe({
      next: () => { /* redirección ToDo:(ver que hacer luego) */ },
      error: (err) => {
        this.submitting.set(false);
        
        // Si el backend devolvió el objeto estructurado
        if (err.rawError?.errors) {
          const serverErrors = err.rawError.errors;
          
          Object.keys(serverErrors).forEach(key => {
            // Buscamos el control (ajustando minúsculas/mayúsculas)
            const control = this.registerForm.get(key.toLowerCase()) || this.registerForm.get(key);
            if (control) {
              control.setErrors({ serverError: serverErrors[key][0] });
            }
          });
        } else {
          this.submitError.set(err.message);
        }
      }
    });
  }
}
