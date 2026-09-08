import { Routes } from '@angular/router';

import { CharacterSheet } from './character-sheet/character-sheet';
import { Characters } from './characters/characters';
import { CreateCharacterSheet } from './create-character-sheet/create-character-sheet';
import { Home } from './home/home';
import { GeneralManager } from './general-manager/general-manager';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    pathMatch: 'full'
  },
  {
    path: 'characters',
    component: Characters
  },
  {
    path: 'new-character',
    component: CreateCharacterSheet
  },
  {
    path: 'character/:id',
    component: CharacterSheet
  },
  {
    path: 'voce-nao-deveria-estar-aqui',
    component: GeneralManager
  }
];
