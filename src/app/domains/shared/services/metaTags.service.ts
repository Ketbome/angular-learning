import { inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

interface PageMetaData {
  title: string;
  description: string;
  image: string;
  url: string;
}

const defaultMetaData: PageMetaData = {
  title: 'Ng Store',
  description: 'Esta es una descripcion',
  image: 'localhost.com',
  url: 'loalhost.coim',
};

@Injectable({
  providedIn: 'root',
})
export class MetaTagsService {
  titleService = inject(Title);
  metaService = inject(Meta);

  updateMetaTags(metaData: Partial<PageMetaData>) {
    const metaDataMerge = {
      ...defaultMetaData,
      ...metaData,
    };

    const tags = this.generateMetaDefinitions(metaDataMerge);

    tags.forEach((tag) => this.metaService.updateTag(tag));

    this.titleService.setTitle(metaDataMerge.title);
  }

  private generateMetaDefinitions(metaData: PageMetaData): MetaDefinition[] {
    return [
      {
        name: 'title',
        content: metaData.title,
      },
      {
        name: 'description',
        content: metaData.description,
      },
      {
        name: 'og:title',
        content: metaData.title,
      },
      {
        name: 'og:description',
        content: metaData.description,
      },
      {
        name: 'og:image',
        content: metaData.image,
      },
      {
        name: 'og:url',
        content: metaData.url,
      },
    ];
  }
}
