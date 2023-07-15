import use from "react";

export interface SiteLoader {
  getSite(id: string): {};
  getPage(id: string): {};
}

export class GraphqlLiveSiteLoader implements SiteLoader {
  public getSite(id: string): {} {
    return {};
  }

  public getPage(id: string): {} {
    return {};
  }
}
