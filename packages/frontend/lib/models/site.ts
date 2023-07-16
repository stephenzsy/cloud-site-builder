import { RelationResponseCollection } from "./common";
import { ComponentSlotContent } from "./components";

export interface Site {
  locale: string;
  content: ComponentSlotContent[];
  localizations: RelationResponseCollection<Site>;
  cssVariables?: string[];
}
