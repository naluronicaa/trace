import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import type { Character } from '../models/character.model';

type StepKey = 'anomaly' | 'reality' | 'competency';

const createDefaultCharacter = (): Character => {
  const qualities = {
    attention: 0,
    empathy: 0,
    presence: 0,
    duplicity: 0,
    initiative: 0,
    professionalism: 0,
    dynamism: 0,
    persistence: 0,
    subtlety: 0
  };

  const burnout = {
    attention: 0,
    empathy: 0,
    presence: 0,
    duplicity: 0,
    initiative: 0,
    professionalism: 0,
    dynamism: 0,
    persistence: 0,
    subtlety: 0
  };

  return {
    id: Date.now(),
    name: '',
    pronouns: '',
    anomaly: { name: '', description: '', equipment: [] },
    reality: {
      name: '',
      description: '',
      gatilho: '',
      alivio: ''
    },
    competency: {
      name: '',
      description: '',
      merito: '',
      demerito: ''
    },
    qualities,
    qualities_in_game: { ...qualities },
    relationships: [],
    merits: 0,
    demerits: 0,
    burnout,
    burnout_in_game: { ...burnout },
    injuries: [],
    questionnaire: {
      appearance: '',
      powersAppearance: '',
      others: ''
    }
  };
};

@Component({
  selector: 'app-create-character-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-character-sheet.html',
  styleUrl: './create-character-sheet.css'
})
export class CreateCharacterSheet {
  constructor(private readonly router: Router) {}

  protected readonly steps: { key: StepKey; label: string }[] = [
    { key: 'anomaly', label: 'Anomalia' },
    { key: 'reality', label: 'Realidade' },
    { key: 'competency', label: 'Competência' }
  ];

  protected readonly anomalyOptions = [
    'Sussurro',
    'Catálogo',
    'Drenagem',
    'Cronometria',
    'Crescimento',
    'Arma',
    'Sonho',
    'Emaranhado',
    'Ausência'
  ];
  protected readonly realityOptions =  [
    'Cuidador',
    'Sobrecarregado',
    'Perseguido',
    'Estrela',
    'Endividado',
    'Recém-Nascido',
    'Romântico',
    'Mandachuva',
    'Criatura'
  ];
  protected readonly competencyOptions =  [
    'RP',
    'P&D',
    'Barista',
    'CEO',
    'Estagiário',
    'Coveiro',
    'Recepção',
    'Atendimento',
    'Palhaço'
  ];

  protected currentStep: StepKey = 'anomaly';
  protected character: Character = createDefaultCharacter();

  protected get currentStepIndex(): number {
    return this.steps.findIndex((step) => step.key === this.currentStep);
  }

  protected get isLastStep(): boolean {
    return this.currentStepIndex === this.steps.length - 1;
  }

  protected get isAtCharacterLimit(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const raw = window.localStorage.getItem('trace-personagens');
    const list = raw ? (JSON.parse(raw) as Character[]) : [];

    return Array.isArray(list) && list.length >= 3;
  }

  protected isFormValid(): boolean {
    const character = this.character;

    const requiredTextFields = [
      character.name,
      character.pronouns,
      character.anomaly.name,
      character.anomaly.description,
      character.reality.name,
      character.reality.description,
      character.reality.gatilho,
      character.reality.alivio,
      character.competency.name,
      character.competency.description,
      character.competency.merito,
      character.competency.demerito,
      character.questionnaire.appearance,
      character.questionnaire.powersAppearance,
      character.questionnaire.others
    ];

    const hasRequiredText = requiredTextFields.every((value) => value.trim().length > 0);
    const hasRequiredQualities = Object.values(character.qualities).every((value) => typeof value === 'number');
    const hasValidEquipment = (character.anomaly.equipment ?? []).every((item) => {
      const hasName = item.name.trim().length > 0;
      const hasDescription = item.description.trim().length > 0;
      return hasName && hasDescription;
    });

    return hasRequiredText && hasRequiredQualities && hasValidEquipment;
  }

  protected addEquipment(): void {
    const equipment = this.character.anomaly.equipment ?? [];
    equipment.push({ name: '', description: '' });
    this.character.anomaly.equipment = equipment;
  }

  protected removeEquipment(index: number): void {
    const equipment = this.character.anomaly.equipment ?? [];
    if (index < 0 || index >= equipment.length) {
      return;
    }

    equipment.splice(index, 1);
    this.character.anomaly.equipment = equipment;
  }

  protected trackByEquipment(index: number): number {
    return index;
  }

  protected nextStep(): void {
    if (this.isAtCharacterLimit) {
      window.alert('Sinto muito, seu eu exterior pode ter apenas 3 colaboradores nessa filial (que formidável você hein?)');
      return;
    }

    const index = this.currentStepIndex;

    if (index < this.steps.length - 1) {
      this.currentStep = this.steps[index + 1].key;
      return;
    }

    if (!this.isFormValid()) {
      window.alert('Preencha todos os campos antes de salvar o personagem.');
      return;
    }

    this.saveCharacter();
  }

  protected prevStep(): void {
    const index = this.currentStepIndex;
    if (index > 0) {
      this.currentStep = this.steps[index - 1].key;
    }
  }

  protected saveCharacter(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.isAtCharacterLimit) {
      window.alert('Sinto muito, seu eu exterior pode ter apenas 3 colaboradores nessa filial (que formidável você hein?)');
      return;
    }

    const key = 'trace-personagens';
    const raw = window.localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) as Character[] : [];

    const existingIds = list
      .map((character) => Number(character.id))
      .filter((value) => Number.isInteger(value));

    let nextId = 1;
    while (nextId <= 3 && existingIds.includes(nextId)) {
      nextId += 1;
    }

    if (nextId > 3) {
      window.alert('Sinto muito, seu eu exterior pode ter apenas 3 colaboradores nessa filial (que formidável você hein?)');
      return;
    }

    const payload: Character = {
      ...this.character,
      id: nextId,
      name: this.character.name.trim() || 'Agente sem nome'
    };

    list.push(payload);
    window.localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new Event('trace-personagens-updated'));
    this.router.navigate(['/character', payload.id]);
  }
}
