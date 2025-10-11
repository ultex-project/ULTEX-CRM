import { IDemandeClient } from 'app/shared/model/demande-client.model';
import { TypeDemande } from 'app/shared/model/enumerations/type-demande.model';

export interface IProduitDemande {
  id?: number;
  typeProduit?: string | null;
  typeDemande?: keyof typeof TypeDemande;
  nomProduit?: string;
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
  origine?: string | null;
  contactFournisseur?: string | null;
  adresseChargement?: string | null;
  adresseDechargement?: string | null;
  ficheTechniqueUrl?: string | null;
  photosUrl?: string | null;
  piecesJointesUrl?: string | null;
  demande?: IDemandeClient | null;
}

export const defaultValue: Readonly<IProduitDemande> = {};
