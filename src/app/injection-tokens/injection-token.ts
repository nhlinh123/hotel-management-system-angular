import {InjectionToken} from '@angular/core';
import {IAuthentication} from '../interfaces/authentication.interface';

export const AUTHENTICATION_SERVICE_TOKEN = new InjectionToken<IAuthentication>('AUTHENTICATION_SERVICE_TOKEN');
