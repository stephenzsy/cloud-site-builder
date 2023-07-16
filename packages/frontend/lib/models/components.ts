export const enum ComponentContentSvgIconSchema {
  fontawesome = "fontawesome",
}

export interface ComponentContentSvgIcon {
  iconData?: any;
  schema?: ComponentContentSvgIconSchema;
}

export interface ComponentSlotContent {
  slotName?: string;
  textValue?: string;
  svgIcon?: ComponentContentSvgIcon;
}
