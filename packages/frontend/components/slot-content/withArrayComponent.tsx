import { ComponentSlotContent } from "@/lib/models/entities";
import type { ComponentType } from "react";

export function withArrayComponent<P extends { content: ComponentSlotContent }>(
  component: React.ComponentType<P>
): React.ComponentType<
  { content: ComponentSlotContent[] | null | undefined } & Omit<P, "content">
> {
  const Component: ComponentType<any> = component;
  return function ComponentWithExplodingProps({ content, ...restProps }) {
    if (!content || content.length === 0) {
      return null;
    }
    if (content.length === 1) {
      return <Component content={content[0]} {...restProps} />;
    }
    return (
      <>
        {content.map((entry, index) => (
          <Component key={index} content={entry} {...restProps} />
        ))}
      </>
    );
  };
}
