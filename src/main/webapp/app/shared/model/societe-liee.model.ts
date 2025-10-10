import { IClient } from 'app/shared/model/client.model';

export interface ISocieteLiee {
  id?: number;
  raisonSociale?: string;
  formeJuridique?: string | null;
  ice?: string | null;
  rc?: string | null;
  nif?: string | null;
  secteurActivite?: string | null;
  tailleEntreprise?: string | null;
  adresseSiege?: string | null;
  representantLegal?: string | null;
  client?: IClient | null;
}

export const defaultValue: Readonly<ISocieteLiee> = {};
