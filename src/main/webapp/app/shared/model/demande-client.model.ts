import dayjs from 'dayjs';
import { IClient } from 'app/shared/model/client.model';
import { IDevise } from 'app/shared/model/devise.model';
import { IIncoterm } from 'app/shared/model/incoterm.model';
import { ISousService } from 'app/shared/model/sous-service.model';
import { ServicePrincipal } from 'app/shared/model/enumerations/service-principal.model';
import { TypeDemande } from 'app/shared/model/enumerations/type-demande.model';

export interface IDemandeClient {
  id?: number;
  reference?: string;
  dateDemande?: dayjs.Dayjs;
  servicePrincipal?: keyof typeof ServicePrincipal;
  typeDemande?: keyof typeof TypeDemande;
  provenance?: string | null;
  remarqueGenerale?: string | null;
  client?: IClient | null;
  devise?: IDevise | null;
  incoterm?: IIncoterm | null;
  sousServices?: ISousService[] | null;
}

export const defaultValue: Readonly<IDemandeClient> = {};
