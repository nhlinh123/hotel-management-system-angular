import { Injectable } from '@angular/core';

export class ApiException extends Error {
  
  constructor(
    public override message: string,
    public statusCode?: number,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiErrorService {
  
  handleError(error: any): ApiException {
    let statusCode = error.status || -1;
    let errorCode = error.error?.code || 'UNKNOWN_ERROR';
    let message = error.error?.message || error.message || 'An error occurred';

    if (error.status === 0) {
      message = 'Network error. Please check your connection.';
      errorCode = 'NETWORK_ERROR';
    } else if (error.status === 404) {
      message = 'Resource not found';
      errorCode = 'NOT_FOUND';
    } else if (error.status === 401) {
      message = 'Unauthorized. Please login again.';
      errorCode = 'UNAUTHORIZED';
    } else if (error.status === 403) {
      message = 'Forbidden. You do not have permission.';
      errorCode = 'FORBIDDEN';
    } else if (error.status >= 500) {
      message = 'Server error. Please try again later.';
      errorCode = 'SERVER_ERROR';
    }

    return new ApiException(message, statusCode, errorCode);
  }
}
