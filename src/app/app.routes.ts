import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { StoreListComponent } from './components/store-list/store-list.component';
import { StoreFormComponent } from './components/store-form/store-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'stores', component: StoreListComponent },
  { path: 'stores/new', component: StoreFormComponent, canActivate: [adminGuard] },
  { path: 'stores/:id/edit', component: StoreFormComponent, canActivate: [adminGuard] },
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent, canActivate: [adminGuard] },
  { path: 'products/:id/edit', component: ProductFormComponent, canActivate: [adminGuard] },
  { path: 'stores/:id/products', component: ProductListComponent },
];
