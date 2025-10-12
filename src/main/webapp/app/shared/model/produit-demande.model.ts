import { IDemandeClient } from 'app/shared/model/demande-client.model';
import { TypeProduit } from 'app/shared/model/enumerations/type-produit.model';

export interface IProduitDemande {
  id?: number;
  typeProduit?: keyof typeof TypeProduit;
  nomProduit?: string;
  description?: string | null;
  quantite?: number | null;
  unite?: string | null;
  prix?: number | null;
  poidsKg?: number | null;
  volumeTotalCbm?: number | null;
  dimensions?: string | null;
  hsCode?: string | null;
  prixCible?: number | null;
  fraisExpedition?: number | null;
  origine?: string | null;
  fournisseur?: string | null;
  adresseChargement?: string | null;
  adresseDechargement?: string | null;
  ficheTechniqueUrl?: string | null;
  photosUrl?: string | null;
  piecesJointesUrl?: string | null;
  demande?: IDemandeClient | null;
}

export const defaultValue: Readonly<IProduitDemande> = {};
