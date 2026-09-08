import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCharacterSheet } from './create-character-sheet';

describe('CreateCharacterSheet', () => {
  let component: CreateCharacterSheet;
  let fixture: ComponentFixture<CreateCharacterSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCharacterSheet],
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
});
