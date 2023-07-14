import ContentComponentSvgIcon from "./content/SvgIcon";
import ContentComponentShortText from "./content/ShortText";
import { ComponentContentType, ComponentContentTypeName } from "./types";

const componentMapping: Partial<
  Record<ComponentContentTypeName, React.ComponentType<{ content: any }>>
> = {
  ComponentContentSvgIcon: ContentComponentSvgIcon,
  ComponentContentShortText: ContentComponentShortText
};

export function SelectSlotWithContent({
  slotId,
  content,
}: {
  slotId: string;
  content?: ComponentContentType[] | null;
}) {
  if (!content) {
    return null;
  }
  const filtered = content.filter(
    (c) => c.__typename && c.targets?.data.some((i) => i.id === slotId)
  );
  return (
    <>
      {filtered.map((f, index) => {
        const ContentComponent = componentMapping[f.__typename!];
        return ContentComponent && <ContentComponent key={index} content={f} />;
      })}
    </>
  );
}
