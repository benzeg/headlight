export interface Link {
  readonly url: string;
}

export class Page implements Link {
  url = '';
  audits = [];
  hrefs = [];
  constructor(url: string) {
    this.url = url;
  }
  addHref(href: string) {
    //requires utils 
  }
} 