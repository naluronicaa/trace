import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import type { Character } from '../models/character.model';

@Component({
  selector: 'app-character-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.css'
})
export class CharacterSheet implements OnInit {
  protected character: Character | null = null;
  protected readonly maxTriangles = 9;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadCharacter();
  }

  protected getTriangleStates(value: number): boolean[] {
    const safeValue = Math.max(0, Math.min(this.maxTriangles, Number(value) || 0));
    return Array.from({ length: this.maxTriangles }, (_, index) => index < safeValue);
  }

  protected setTriangleValue(group: 'qualities_in_game' | 'burnout_in_game', key: keyof Character['qualities_in_game'], value: number): void {
    if (!this.character) {
      return;
    }

    const currentValue = Number(this.character[group][key] ?? 0);
    const safeValue = Math.max(0, Math.min(this.maxTriangles, Number(value) || 0));
    const nextValue = currentValue === safeValue ? 0 : safeValue;

    this.character[group][key] = nextValue as never;
  }

  protected normalizeCharacter(character: Character): Character {
    const toNumber = (value: number | undefined): number => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const syncGameValue = (maxValue: number, inGameValue: number): number => {
      if (inGameValue === 0 && maxValue > 0) {
        return maxValue;
      }
      return inGameValue;
    };

    const qualities = {
      attention: toNumber(character.qualities?.attention),
      empathy: toNumber(character.qualities?.empathy),
      presence: toNumber(character.qualities?.presence),
      duplicity: toNumber(character.qualities?.duplicity),
      initiative: toNumber(character.qualities?.initiative),
      professionalism: toNumber(character.qualities?.professionalism),
      dynamism: toNumber(character.qualities?.dynamism),
      persistence: toNumber(character.qualities?.persistence),
      subtlety: toNumber(character.qualities?.subtlety)
    };

    const burnout = {
      attention: toNumber(character.burnout?.attention),
      empathy: toNumber(character.burnout?.empathy),
      presence: toNumber(character.burnout?.presence),
      duplicity: toNumber(character.burnout?.duplicity),
      initiative: toNumber(character.burnout?.initiative),
      professionalism: toNumber(character.burnout?.professionalism),
      dynamism: toNumber(character.burnout?.dynamism),
      persistence: toNumber(character.burnout?.persistence),
      subtlety: toNumber(character.burnout?.subtlety)
    };

    return {
      ...character,
      qualities,
      qualities_in_game: {
        attention: syncGameValue(qualities.attention, toNumber(character.qualities_in_game?.attention)),
        empathy: syncGameValue(qualities.empathy, toNumber(character.qualities_in_game?.empathy)),
        presence: syncGameValue(qualities.presence, toNumber(character.qualities_in_game?.presence)),
        duplicity: syncGameValue(qualities.duplicity, toNumber(character.qualities_in_game?.duplicity)),
        initiative: syncGameValue(qualities.initiative, toNumber(character.qualities_in_game?.initiative)),
        professionalism: syncGameValue(qualities.professionalism, toNumber(character.qualities_in_game?.professionalism)),
        dynamism: syncGameValue(qualities.dynamism, toNumber(character.qualities_in_game?.dynamism)),
        persistence: syncGameValue(qualities.persistence, toNumber(character.qualities_in_game?.persistence)),
        subtlety: syncGameValue(qualities.subtlety, toNumber(character.qualities_in_game?.subtlety))
      },
      burnout,
      burnout_in_game: {
        attention: syncGameValue(burnout.attention, toNumber(character.burnout_in_game?.attention)),
        empathy: syncGameValue(burnout.empathy, toNumber(character.burnout_in_game?.empathy)),
        presence: syncGameValue(burnout.presence, toNumber(character.burnout_in_game?.presence)),
        duplicity: syncGameValue(burnout.duplicity, toNumber(character.burnout_in_game?.duplicity)),
        initiative: syncGameValue(burnout.initiative, toNumber(character.burnout_in_game?.initiative)),
        professionalism: syncGameValue(burnout.professionalism, toNumber(character.burnout_in_game?.professionalism)),
        dynamism: syncGameValue(burnout.dynamism, toNumber(character.burnout_in_game?.dynamism)),
        persistence: syncGameValue(burnout.persistence, toNumber(character.burnout_in_game?.persistence)),
        subtlety: syncGameValue(burnout.subtlety, toNumber(character.burnout_in_game?.subtlety))
      }
    };
  }

  protected loadCharacter(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const raw = localStorage.getItem('trace-personagens');
    const list = raw ? (JSON.parse(raw) as Character[]) : [];

    const found = list.find((item) => Number(item.id) === id);
    this.character = found ? this.normalizeCharacter(found) : null;
  }

  protected saveCharacter(): void {
    if (!this.character) {
      return;
    }

    const raw = localStorage.getItem('trace-personagens');
    const list = raw ? (JSON.parse(raw) as Character[]) : [];

    const updated = list.map((item) =>
      Number(item.id) === Number(this.character?.id) ? { ...this.character } : item
    );

    localStorage.setItem('trace-personagens', JSON.stringify(updated));
    window.dispatchEvent(new Event('trace-personagens-updated'));
    window.location.reload();
    this.loadCharacter();
    window.alert('Personagem atualizado com sucesso.');
  }

  protected downloadCharacterJson(): void {
    if (!this.character) {
      return;
    }

    const payload = JSON.stringify(this.character, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const safeName = (this.character.name || 'personagem').trim().replace(/\s+/g, '-').toLowerCase();

    anchor.href = url;
    anchor.download = `personagem-${this.character.id || 'sem-id'}-${safeName}.json`;
    anchor.click();

    window.URL.revokeObjectURL(url);
  }
}
