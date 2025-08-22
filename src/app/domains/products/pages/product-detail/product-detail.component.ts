import { Component, inject, input, linkedSignal, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductService } from '@shared/services/product.service';
import { CartService } from '@shared/services/cart.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { MetaTagsService } from '@shared/services/metaTags.service';
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
  private readonly metaTagService = inject(MetaTagsService);

  constructor() {
    effect(() => {
      const product = this.productRs.value();
      if (product) {
        this.metaTagService.updateMetaTags({
          title: product.title,
          description: product.description,
          image: product.images[0],
          url: `${environment.domain}/product/${product.slug}`,
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
