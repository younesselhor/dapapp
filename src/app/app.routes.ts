import { Routes } from '@angular/router';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductsComponent } from './components/products/products.component';
import { AccessoriesComponent } from './components/accessories/accessories.component';

export const routes: Routes = [
  {
    path:'',
    redirectTo:'plates',
    pathMatch:'full'

  },
  {
    path: 'plates',
    component: ProductsComponent
  },
  {
    path: 'accessories',
    component: AccessoriesComponent
  },

];
