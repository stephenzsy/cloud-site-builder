import { ComponentContentSvgIcon } from "@/lib/generated/graphql";

export default function ContentComponentSvgIcon({
  content,
}: {
  content: ComponentContentSvgIcon;
}) {
  return (
    <svg
      className="w-full h-full"
      viewBox={`0 0 ${content.width} ${content.height}`}
    >
      {(content.iconPathData as string[]).map((d: string, index) => (
        <path key={index} d={d} />
      ))}
    </svg>
  );
}
