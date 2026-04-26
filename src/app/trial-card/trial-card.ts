import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicalTrial } from '../models/clinical-trial';

@Component({
  selector: 'app-trial-card',
  imports: [CommonModule],
  templateUrl: './trial-card.html',
  styleUrl: './trial-card.css',
})

export class TrialCard {
  // @Input() permite que el componente padre nos pase un valor.
  // Equivalente a un parámetro de constructor en C#, pero por DOM attribute.
  @Input({ required: true }) trial!: ClinicalTrial;

  //Método helper para devolver el color seguún el status
  getStatusColor(): string {
    switch(this.trial.status.toLowerCase()) {
      case 'recruiting': return '#fbbc04';
      case 'active': return '#34a853';
      case 'completed': return '#9aa0a6';
      case 'cancelled': return '#ea4335';
      default: return '#757575';
    }
  }  
}