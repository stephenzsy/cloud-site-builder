export type ID = string;

export type BlockEntityRef = {
  id: ID;
};

type BlockRelationResponseCollection = {
  data: (BlockEntityRef & {
    attributes: {
      locale: string;
    };
  })[];
};

export type BlockEntityRefResponse = {
  data: BlockEntityRef;
};

export type ComponentContentSimple = {
  link: BlockEntityRefResponse;
  richText: String;
  text: String;
};

export const enum BlockType {
  generic = "generic",
  page = "page",
  site = "site",
}

export type ComponentSlotBlock = {
  block: BlockEntityRefResponse;
  simple: ComponentContentSimple;
  slotName?: string;
};

export type Block = {
  componentType?: string;
  locale: string;
  localizations: BlockRelationResponseCollection;
  props?: any;
  simple?: ComponentContentSimple;
  slots: ComponentSlotBlock[];
  type: BlockType;
};

export type BlockEntity = BlockEntityRef & {
  id: ID;
  attributes: Block;
};

export type BlockEntityResponse = {
  data: BlockEntity;
};
