import { ComponentContentShortText } from "@/lib/generated/graphql";

export default function ContentComponentShortText({
  content,
}: {
  content: ComponentContentShortText;
}) {
  return content.value
}
