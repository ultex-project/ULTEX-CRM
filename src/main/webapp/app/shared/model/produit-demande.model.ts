import { IDemandeClient } from 'app/shared/model/demande-client.model';

export interface IProduitDemande {
  id?: number;
  typeProduit?: string | null;
  typeDemande?: string | null;
  nomProduit?: string | null;
  description?: string | null;
  quantite?: number | null;
  unite?: string | null;
  prix?: number | null;
  fraisExpedition?: number | null;
  poidsKg?: number | null;
  volumeTotalCbm?: number | null;
  dimensions?: string | null;
  nombreCartons?: number | null;
  piecesParCarton?: number | null;
  hsCode?: string | null;
  prixCible?: number | null;
  ficheTechniqueUrl?: string | null;
  photosUrl?: string | null;
  piecesJointesUrl?: string | null;
  demande?: IDemandeClient | null;
}

export const defaultValue: Readonly<IProduitDemande> = {};
