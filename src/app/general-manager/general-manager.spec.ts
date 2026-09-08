import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralManager } from './general-manager';

describe('GeneralManager', () => {
  let component: GeneralManager;
  let fixture: ComponentFixture<GeneralManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralManager],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
