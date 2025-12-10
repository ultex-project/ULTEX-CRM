import dayjs from 'dayjs';
import { ILangue } from 'app/shared/model/langue.model';
import { IPays } from 'app/shared/model/pays.model';
import { ICompany } from 'app/shared/model/company.model';
import { ClientStatus } from 'app/shared/model/enumerations/client-status.model';

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
  telephonePrincipal?: string;
  whatsapp?: string | null;
  email?: string | null;
  adressePersonnelle?: string | null;
  adressesLivraison?: string | null;
  status?: ClientStatus | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  languePreferee?: ILangue | null;
  pays?: IPays | null;
  company?: ICompany | null;
}

export const defaultValue: Readonly<IClient> = {};
