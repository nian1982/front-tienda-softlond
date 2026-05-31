import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { Product } from '../models/product.model';
import { Store } from '../models/store.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  // PRODUCTS
  getProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}/products`).pipe(map(r => r.data));
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}/products/all`).pipe(map(r => r.data));
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/products/${id}`).pipe(map(r => r.data));
  }

  createProduct(p: Product): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(`${this.baseUrl}/products`, p).pipe(map(r => r.data));
  }

  updateProduct(id: string, p: Product): Observable<Product> {
    return this.http.put<ApiResponse<Product>>(`${this.baseUrl}/products/${id}`, p).pipe(map(r => r.data));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/products/${id}`).pipe(map(() => undefined));
  }

  searchProductsByName(name: string): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}/products/search?name=${name}`).pipe(map(r => r.data));
  }

  // STORES
  getStores(): Observable<Store[]> {
    return this.http.get<ApiResponse<Store[]>>(`${this.baseUrl}/stores`).pipe(map(r => r.data));
  }

  getAllStores(): Observable<Store[]> {
    return this.http.get<ApiResponse<Store[]>>(`${this.baseUrl}/stores/all`).pipe(map(r => r.data));
  }

  getStore(id: string): Observable<Store> {
    return this.http.get<ApiResponse<Store>>(`${this.baseUrl}/stores/${id}`).pipe(map(r => r.data));
  }

  createStore(s: Store): Observable<Store> {
    return this.http.post<ApiResponse<Store>>(`${this.baseUrl}/stores`, s).pipe(map(r => r.data));
  }

  updateStore(id: string, s: Store): Observable<Store> {
    return this.http.put<ApiResponse<Store>>(`${this.baseUrl}/stores/${id}`, s).pipe(map(r => r.data));
  }

  deleteStore(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/stores/${id}`).pipe(map(() => undefined));
  }

  reactivateStore(id: string): Observable<Store> {
    return this.http.patch<ApiResponse<Store>>(`${this.baseUrl}/stores/${id}/reactivate`, {}).pipe(map(r => r.data));
  }

  getProductsByStore(storeId: string): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}/stores/${storeId}/products`).pipe(map(r => r.data));
  }

  reactivateProduct(id: string): Observable<Product> {
    return this.http.patch<ApiResponse<Product>>(`${this.baseUrl}/products/${id}/reactivate`, {}).pipe(map(r => r.data));
  }
}
