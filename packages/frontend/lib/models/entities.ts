import { Component } from "react";
import { EntityResponse, RelationResponseCollection } from "./common";

// components
export const enum ComponentContentSvgIconSchema {
  fontawesome = "fontawesome",
}

export interface ComponentContentSvgIcon {
  iconData: any;
  schema: ComponentContentSvgIconSchema;
}

export interface ComponentSlotContent {
  slotName?: string;
  textValue?: string;
  svgIcon?: ComponentContentSvgIcon;
  section?: EntityResponse<Section>;
}

// entities
export type LocalizedEntity<T> = {
  locale: string;
  localizations: RelationResponseCollection<T>;
};

export interface Section extends LocalizedEntity<Section> {
  content: ComponentSlotContent[];
  templateId: string;
}

export interface Site extends LocalizedEntity<Site> {
  content: ComponentSlotContent[];
  cssVariables: string[];
  pages: RelationResponseCollection<Page>;
}

export interface Page extends LocalizedEntity<Page> {
  content: ComponentSlotContent[];
  slug: string;
}
