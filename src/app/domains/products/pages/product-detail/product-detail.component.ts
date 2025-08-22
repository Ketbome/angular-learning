import { Component, inject, input, linkedSignal, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductService } from '@shared/services/product.service';
import { CartService } from '@shared/services/cart.service';
import { Meta, Title } from '@angular/platform-browser';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '@env/environment';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './product-detail.component.html',
})
export default class ProductDetailComponent {
  readonly slug = input.required<string>();
  productRs = rxResource({
    params: () => ({
      slug: this.slug(),
    }),
    stream: ({ params }) => {
      return this.productService.getOneBySlug(params.slug);
    },
  });
  $cover = linkedSignal({
    source: this.productRs.value,
    computation: (product, previousValue) => {
      return product?.images[0] ?? previousValue;
    },
  });
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  titleService = inject(Title);
  metaService = inject(Meta);

  constructor() {
    effect(() => {
      const product = this.productRs.value();
      if (product) {
        this.titleService.setTitle(product.title);
        this.metaService.updateTag({
          name: 'description',
          content: product.description,
        });
        this.metaService.updateTag({
          name: 'og:title',
          content: product.title,
        });
        this.metaService.updateTag({
          name: 'og:image',
          content: product.images[0],
        });
        this.metaService.updateTag({
          name: 'og:description',
          content: product.description,
        });
        this.metaService.updateTag({
          name: 'og:url',
          content: `${environment.domain}/product/${this.slug()}`,
        });
      }
    });
  }

  changeCover(newImg: string) {
    this.$cover.set(newImg);
  }

  addToCart() {
    const product = this.productRs.value();
    if (product) {
      this.cartService.addToCart(product);
    }
  }
}
