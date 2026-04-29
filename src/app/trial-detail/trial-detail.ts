import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TrialService } from '../services/trial';
import { ClinicalTrial } from '../models/clinical-trial';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-trial-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './trial-detail.html',
  styleUrl: './trial-detail.css',
})

export class TrialDetail  implements OnInit {
  private route = inject(ActivatedRoute);
  private trialService = inject(TrialService);

  trial = signal<ClinicalTrial | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error.set('ID de estudio inválido');
      this.loading.set(false);
      return;
    }

    const id = Number(idParam);
    this.trialService.getTrialById(id).subscribe({
      next: (data) => {
        this.trial.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(
          err.status === 404 
            ? `No existe el estudio con ID ${id}` 
            : 'Error al cargar el estudio clínico'
        );
        this.loading.set(false);
      }
    });
  }
}
