import { ImageResponse, NextResponse } from "next/server";
import { getLoaderConfig } from "./_utils";

export const size = {
  width: 32,
  height: 32,
};
export default async function Icon() {
  const loaderConfig = getLoaderConfig();
  if (!loaderConfig) {
    return new NextResponse(null, { status: 404 });
  }
  const [loader, siteId] = loaderConfig;
  const site = await loader.getSiteAsync(siteId);
  const icon = site?.attributes?.content?.find(
    (c) => c.slotName === "site-icon"
  )?.svgIcon;
  if (!icon) {
    return new NextResponse(null, { status: 404 });
  }
  const [width, height, , , pathData] = icon.iconData;
  return new ImageResponse(
    (
      <svg width={32} height={32} viewBox={`0 0 ${width} ${height}`}>
        {(pathData as Array<[string, string]>).map(([d, fill], index) => (
          <path key={index} d={d} fill={fill} />
        ))}
      </svg>
    ),
    {
      width: 32,
      height: 32,
    }
  );
}
