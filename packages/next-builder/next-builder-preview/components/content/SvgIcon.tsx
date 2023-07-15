import { ComponentContentSvgIcon } from "@/lib/generated/graphql";

export default function SvgIcon({
  content,
}: {
  content: ComponentContentSvgIcon;
}) {
  return (
    <svg
      className="w-full h-full fill-current"
      viewBox={`0 0 ${content.width} ${content.height}`}
    >
      {(content.iconPathData as string[]).map((d: string, index) => (
        <path key={index} d={d} />
      ))}
    </svg>
  );
}
