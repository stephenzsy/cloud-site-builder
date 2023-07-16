import { ComponentSlotContent } from "@/lib/models/components";

export function withArrayComponent(
  Component: React.ComponentType<{ content: ComponentSlotContent }>
): React.ComponentType<{ content: ComponentSlotContent[] | null | undefined }> {
  return function ComponentWithExplodingProps({ content }) {
    if (!content || content.length === 0) {
      return null;
    }
    if (content.length === 1) {
      return <Component content={content[0]} />;
    }
    return (
      <>
        {content.map((entry, index) => (
          <Component key={index} content={entry} />
        ))}
      </>
    );
  };
}
