import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrialService } from '../services/trial';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { parseHttpError } from '../utils/error-parser';

@Component({
  selector: 'app-trial-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './trial-form.html',
  styleUrl: './trial-form.css',
})
export class TrialForm {
  private fb =   inject(FormBuilder);
  private trialService = inject(TrialService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Estados del submit
  submitting = signal(false);
  submitError = signal<string | null>(null);
  initialLoading = signal(false);
  
  isEditMode = signal(false);
  trialId = signal<number | null>(null);

  // Formulario reactivo
  trialForm: FormGroup = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/^[A-Z0-9-]+$/)
    ]],
    phase: ['', Validators.required],
    patientCount: [0, [
      Validators.required,
      Validators.min(1),
      Validators.max(100000)
    ]],
    status: ['Recruiting', Validators.required],
    startDate: ['', Validators.required]
  });

  // Listas para los selects
  phases = ['I', 'II', 'III', 'IV'];
  statuses = ['Recruiting', 'Active', 'Completed', 'Cancelled'];

  // Helper para acceder a los controles desde el template
  control(name: string): AbstractControl {
    return this.trialForm.controls[name];
  }

  // Helper para saber si mostrar error
  showError(name: string): boolean {
    const c = this.control(name);
    return c.invalid && c.touched;
  }

  // Mensaje de error según el tipo
  errorMessage(name: string): string {
    const c = this.control(name);
    if (c.errors?.['required']) return 'Este campo es obligatorio.';
    if (c.errors?.['maxlength']) return 'Máximo 100 caracteres.';
    if (c.errors?.['min']) return 'Debe ser mayor a 0.';
    if (c.errors?.['max']) return 'Máximo 100,000.';
    if (c.errors?.['pattern']) return 'Formato inválido (solo mayúsculas, números y guiones).';
    return 'Valor inválido.';
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode.set(true);
      const id = Number(idParam);
      this.trialId.set(id);
      this.initialLoading.set(true);

      this.trialService.getTrialById(id).subscribe({
        next: (trial) => {
          this.trialForm.patchValue({
            name: trial.name,
            phase: trial.phase,
            patientCount: trial.patientCount,
            status: trial.status,
            startDate: trial.startDate.split('T')[0] // Solo la parte de fecha
          });
          this.initialLoading.set(false);
        },
        error: (err) => {
          this.submitError.set(parseHttpError(err));
          this.initialLoading.set(false);
        }
      });
    }
  }

  onSubmit(): void {
    this.submitError.set(null);

    if (this.trialForm.invalid) {
      this.trialForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const data = this.trialForm.getRawValue();
    const currentId = this.trialId();

    const request$ = this.isEditMode() && currentId
      ? this.trialService.updateTrial(currentId!, data) 
      : this.trialService.createTrial(data);
    
    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/trials']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.submitError.set(parseHttpError(err));
      }
    });
  }
}
