import { ComponentSlotContent } from "@/lib/models/components";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withArrayComponent } from "./withArrayComponent";

function svgIcon({ content: { svgIcon } }: { content: ComponentSlotContent }) {
  if (!svgIcon) {
    return null;
  }
  if (svgIcon.schema === "fontawesome") {
    return (
      <FontAwesomeIcon
        icon={
          {
            icon: svgIcon.iconData,
            iconName: "site-logo" as any,
            prefix: "fak",
          } as IconDefinition
        }
      />
    );
  }
  return null;
}

export const SlotContentSvgIcon = withArrayComponent(svgIcon);
