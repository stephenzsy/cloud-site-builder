import { ComponentContentShortText } from "@/lib/generated/graphql";

export default function ShortText({
  content,
}: {
  content: ComponentContentShortText;
}) {
  return content.value;
}
