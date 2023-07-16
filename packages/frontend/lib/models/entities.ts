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
export type LocalizedEntityAttributes<T> = {
  locale: string;
  localizations: RelationResponseCollection<T>;
};

export interface Section extends LocalizedEntityAttributes<Section> {
  content: ComponentSlotContent[];
  templateId: string;
}

export interface Site extends LocalizedEntityAttributes<Site> {
  content: ComponentSlotContent[];
  cssVariables: string[];
  pages: RelationResponseCollection<Page>;
}

export interface Page extends LocalizedEntityAttributes<Page> {
  content: ComponentSlotContent[];
  slug: string;
}
