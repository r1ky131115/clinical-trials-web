import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrialService } from '../services/trial';
import { TrialCard } from '../trial-card/trial-card';

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

  ngOnInit(): void {
    // Cargamos los trials al iniciar el componente
    this.trialService.loadTrials();
  }

  // Método para reintentar si falla la carga
  retry() {
    this.trialService.loadTrials();
  }
}
