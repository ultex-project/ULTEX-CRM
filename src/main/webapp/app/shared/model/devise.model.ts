export interface IDevise {
  id?: number;
  code?: string;
  nomComplet?: string;
  symbole?: string | null;
  pays?: string | null;
}

export const defaultValue: Readonly<IDevise> = {};
