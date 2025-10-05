import dayjs from 'dayjs';
import { ICompany } from 'app/shared/model/company.model';

export interface IClient {
  id?: number;
  code?: string;
  nomComplet?: string;
  photoUrl?: string | null;
  dateNaissance?: dayjs.Dayjs | null;
  lieuNaissance?: string | null;
  nationalite?: string;
  genre?: string | null;
  fonction?: string | null;
  languePreferee?: string | null;
  telephonePrincipal?: string;
  whatsapp?: string | null;
  email?: string | null;
  adressePersonnelle?: string | null;
  adressesLivraison?: string | null;
  reseauxSociaux?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  company?: ICompany | null;
}

export const defaultValue: Readonly<IClient> = {};
