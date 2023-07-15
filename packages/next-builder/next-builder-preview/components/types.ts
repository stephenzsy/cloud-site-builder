import { ComponentContentShortText, ComponentContentSvgIcon, Error } from "@/lib/generated/graphql";

export type ComponentContentType = Pick<ComponentContentShortText | ComponentContentSvgIcon, "__typename" | "targets">

export type ComponentContentTypeName = string & ComponentContentType["__typename"]