import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { Character } from '../models/character.model';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './characters.html',
  styleUrl: './characters.css',
})
export class Characters implements OnInit {
  protected characters: Character[] = [];

  ngOnInit(): void {
    this.loadCharacters();
  }

  protected loadCharacters(): void {
    const raw = localStorage.getItem('trace-personagens');
    this.characters = raw ? (JSON.parse(raw) as Character[]) : [];
  }
}
