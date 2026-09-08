import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { mdiDelete } from '@mdi/js';

import type { Character } from '../models/character.model';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './characters.html',
  styleUrl: './characters.css',
})
export class Characters implements OnInit, OnDestroy {
  protected readonly mdiDeletePath = mdiDelete;
  protected characters: Character[] = [];

  protected get canCreateNewCharacter(): boolean {
    return this.characters.length < 3;
  }

  ngOnInit(): void {
    this.loadCharacters();
    window.addEventListener('trace-personagens-updated', this.handleStorageUpdate);
  }

  ngOnDestroy(): void {
    window.removeEventListener('trace-personagens-updated', this.handleStorageUpdate);
  }

  private readonly handleStorageUpdate = (): void => {
    this.loadCharacters();
  };

  protected loadCharacters(): void {
    const raw = localStorage.getItem('trace-personagens');
    this.characters = raw ? (JSON.parse(raw) as Character[]) : [];
  }

  protected deleteCharacter(characterId: number): void {
    const confirmed = window.confirm('Deseja apagar este colaborador?');

    if (!confirmed) {
      return;
    }

    const raw = localStorage.getItem('trace-personagens');
    const list = raw ? (JSON.parse(raw) as Character[]) : [];
    const updated = list.filter((character) => Number(character.id) !== Number(characterId));

    localStorage.setItem('trace-personagens', JSON.stringify(updated));
    this.loadCharacters();
    window.dispatchEvent(new Event('trace-personagens-updated'));
  }

  protected onUploadCharacter(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const uploaded = JSON.parse(String(reader.result)) as Character;
        const payload = { ...uploaded };
        const existing = this.characters.find((character) => Number(character.id) === Number(payload.id));

        if (this.characters.length >= 3 && !existing) {
          window.alert('Sinto muito, seu eu exterior pode ter apenas 3 colaboradores nessa filial (que formidável você hein?)');
          input.value = '';
          return;
        }

        if (existing) {
          this.characters = this.characters.map((character) =>
            Number(character.id) === Number(payload.id) ? payload : character
          );
        } else {
          this.characters = [...this.characters, payload];
        }

        localStorage.setItem('trace-personagens', JSON.stringify(this.characters));
        this.loadCharacters();
        window.dispatchEvent(new Event('trace-personagens-updated'));
        window.location.reload();
        window.alert(existing ? 'Personagem atualizado com sucesso.' : 'Personagem importado com sucesso.');
        input.value = '';
      } catch {
        window.alert('Arquivo inválido. Envie um JSON de personagem válido.');
        input.value = '';
      }
    };

    reader.readAsText(file);
  }
}
