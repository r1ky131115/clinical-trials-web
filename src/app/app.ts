import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TrialCard } from './trial-card/trial-card';
import { ClinicalTrial } from './models/clinical-trial';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TrialCard], // 👈 importamos el componente
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('clinical-trials-web');

  // Datos hardcodeadeos por ahora
  trials: ClinicalTrial[] = [
    {
      id: 1,
      name: 'GSK-ASTHMA-2026-A',
      phase: 'III',
      patientCount: 450,
      status: 'Recruiting',
      startDate: '2026-01-15'
    },
    {
      id: 2,
      name: 'GSK-ONCO-2025-B',
      phase: 'II',
      patientCount: 120,
      status: 'Active',
      startDate: '2025-09-01'
    },
    {
      id: 3,
      name: 'PXL-CARDIO-2024',
      phase: 'IV',
      patientCount: 800,
      status: 'Completed',
      startDate: '2024-03-10'
    }
  ];
}
