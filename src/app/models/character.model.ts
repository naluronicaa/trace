export interface Character {
  id: number;
  name: string;
  pronouns: string;


  anomaly: {
    name: string;
    description: string;
    equipment?: {
      name: string;
      description: string;
    }[];
  };

  reality: { 
    name: string;
    description: string;
    gatilho: string;
    alivio: string;
  };

  competency: {
    name: string
    description: string;
    merito: string;
    demerito: string;
  };

  qualities: {
    attention: number;
    empathy: number;
    presence: number;
    duplicity: number;
    initiative: number;
    professionalism: number;
    dynamism: number;
    persistence: number;
    subtlety: number;
  };

  qualities_in_game: {
    attention: number;
    empathy: number;
    presence: number;
    duplicity: number;
    initiative: number;
    professionalism: number;
    dynamism: number;
    persistence: number;
    subtlety: number;
  };

  relationships: {
    name: string;
    connection: number;
    description: string;
  }[];

  merits: number;
  demerits: number;

  burnout: {
    attention: number;
    empathy: number;
    presence: number;
    duplicity: number;
    initiative: number;
    professionalism: number;
    dynamism: number;
    persistence: number;
    subtlety: number;
  };

  burnout_in_game: {
    attention: number;
    empathy: number;
    presence: number;
    duplicity: number;
    initiative: number;
    professionalism: number;
    dynamism: number;
    persistence: number;
    subtlety: number;
  };

  injuries: string[];

  questionnaire: {
    appearance: string;
    powersAppearance: string;
    others: string;
  };
}