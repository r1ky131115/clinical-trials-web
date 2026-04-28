import { Component, inject, OnInit } from '@angular/core';
import { TrialCard } from './trial-card/trial-card';
import { TrialService } from './services/trial';

@Component({
  selector: 'app-root',
  imports: [TrialCard], // 👈 importamos el componente
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {
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
