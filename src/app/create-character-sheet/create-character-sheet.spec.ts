import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { CreateCharacterSheet } from './create-character-sheet';

describe('CreateCharacterSheet', () => {
  let component: CreateCharacterSheet;
  let fixture: ComponentFixture<CreateCharacterSheet>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CreateCharacterSheet],
      providers: [{ provide: Router, useValue: router }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCharacterSheet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default in-game values to the same as their max values when missing', () => {
    const normalized = (component as any).normalizeCharacter?.({
      id: 1,
      name: 'Teste',
      pronouns: 'ele/dele',
      anomaly: { name: 'A', description: 'B' },
      reality: { name: 'R', description: 'D', gatilho: 'G', alivio: 'A' },
      competency: { name: 'C', description: 'D', merito: 'M', demerito: 'DM' },
      qualities: {
        attention: 4,
        empathy: 3,
        presence: 2,
        duplicity: 5,
        initiative: 1,
        professionalism: 2,
        dynamism: 3,
        persistence: 4,
        subtlety: 5
      },
      burnout: {
        attention: 2,
        empathy: 1,
        presence: 3,
        duplicity: 4,
        initiative: 2,
        professionalism: 1,
        dynamism: 3,
        persistence: 2,
        subtlety: 1
      },
      relationships: [],
      merits: 0,
      demerits: 0,
      injuries: [],
      questionnaire: {
        appearance: 'A',
        powersAppearance: 'P',
        others: 'O'
      }
    });

    expect(normalized.qualities_in_game.attention).toBe(4);
    expect(normalized.qualities_in_game.empathy).toBe(3);
    expect(normalized.burnout_in_game.attention).toBe(2);
    expect(normalized.burnout_in_game.subtlety).toBe(1);
  });

  it('should allow adding anomaly equipment items', () => {
    component['addEquipment']();
    component['character'].anomaly.equipment?.push({ name: 'Lanterna', description: 'Ilumina o caminho' });

    expect(component['character'].anomaly.equipment).toEqual([
      { name: '', description: '' },
      { name: 'Lanterna', description: 'Ilumina o caminho' }
    ]);
  });

  it('should navigate to the created character page after saving', () => {
    const savedCharacter = {
      ...component['character'],
      name: 'Novo Agente',
      pronouns: 'ela/dela',
      anomaly: { name: 'Sussurro', description: 'Descrição da anomalia', equipment: [] },
      reality: { name: 'Cuidador', description: 'Descrição da realidade', gatilho: 'Gatilho', alivio: 'Alívio' },
      competency: { name: 'RP', description: 'Descrição da competência', merito: 'Mérito', demerito: 'Demérito' },
      questionnaire: { appearance: 'Aparência', powersAppearance: 'Poderes', others: 'Observações' },
      qualities: {
        attention: 1,
        empathy: 2,
        presence: 3,
        duplicity: 4,
        initiative: 5,
        professionalism: 6,
        dynamism: 7,
        persistence: 8,
        subtlety: 9
      }
    };

    component['character'] = savedCharacter;
    localStorage.setItem('trace-personagens', JSON.stringify([]));

    (component as any).saveCharacter();

    expect(router.navigate).toHaveBeenCalledWith(['/character', 1]);
  });
});
