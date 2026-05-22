import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrialService } from '../services/trial';
import { TrialCard } from '../trial-card/trial-card';
import { TRIAL_PHASES, TRIAL_STATUSES } from '../models/trial.types';

@Component({
  selector: 'app-trial-list',
  imports: [RouterLink, TrialCard],
  templateUrl: './trial-list.html',
  styleUrl: './trial-list.css',
})

export class TrialList {
  // Signal para almacenar los trials cargados
  private trialService = inject(TrialService);

  // Exponemos los signals del servicio para que la plantilla pueda usarlos
  trials = this.trialService.trials;
  loading = this.trialService.loading;
  error = this.trialService.error;
  trialCount = this.trialService.trialCount;
  
  phases = TRIAL_PHASES;
  statuses = TRIAL_STATUSES;

  // Signals locales para mantener el estado de los filtros seleccionados
  currentPhase = signal<string>('');
  currentStatus = signal<string>('');

  ngOnInit(): void {
    // Cargamos los trials al iniciar el componente
    this.fetchTrials()
  }

  // Se ejecuta cada vez que cambia algún <select>
  onFilterChange(phase: string, status: string) {
    this.currentPhase.set(phase);
    this.currentStatus.set(status);
    this.fetchTrials();
  }

  // Método unificado para cargar con los filtros actuales
  private fetchTrials() {
    // Convertimos los strings vacíos ('') a undefined para que el servicio no los envíe
    const filters = {
      phase: this.currentPhase() || undefined,
      status: this.currentStatus() || undefined
    };
    
    this.trialService.loadTrials(filters);
  }

  // Método para reintentar si falla la carga
  retry() {
    this.trialService.loadTrials();
  }
}
