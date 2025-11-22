export interface IPays {
  id?: number;
  code?: string;
  nom?: string;
  indicatif?: string | null;
}

export const defaultValue: Readonly<IPays> = {};
