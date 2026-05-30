export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  status: string;
  code: number;
  timestamp: string;
}
