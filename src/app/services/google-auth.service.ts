import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const gapi: any;
declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private CLIENT_ID = '709833410477-osc3o81a0m9r4ub9imfmhofqu8cptop4.apps.googleusercontent.com';
  private API_KEY = 'AIzaSyDUukuK2NLMLUjB3xUKCK0FZs7pR7nF730';
  private SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

  private gapiInited = false;
  private gisInited = false;
  private tokenClient: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  loadGoogleApi(): void {
    if (isPlatformBrowser(this.platformId)) {
      const gapiScript = document.createElement('script');
      gapiScript.src = 'https://apis.google.com/js/api.js';
      gapiScript.async = true;
      gapiScript.defer = true;
      gapiScript.onload = () => this.gapiLoaded();
      document.body.appendChild(gapiScript);

      const gisScript = document.createElement('script');
      gisScript.src = 'https://accounts.google.com/gsi/client';
      gisScript.async = true;
      gisScript.defer = true;
      gisScript.onload = () => this.gisLoaded();
      document.body.appendChild(gisScript);
    } else {
      console.warn('Google APIs cannot be loaded because the platform is not a browser.');
    }
  }

  private gapiLoaded(): void {
    gapi.load('client', () => this.initializeGapiClient());
  }

  private async initializeGapiClient(): Promise<void> {
    await gapi.client.init({
      apiKey: this.API_KEY,
      discoveryDocs: [],
    });
    this.gapiInited = true;
    this.maybeEnableButtons();
  }

  private gisLoaded(): void {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: (response: any) => this.handleAuthResponse(response), // Utilizamos el método aquí
    });
    this.gisInited = true;
    this.maybeEnableButtons();
  }

  private maybeEnableButtons(): void {
    if (this.gapiInited && this.gisInited) {
      console.log('Google APIs loaded successfully');
    }
  }

  handleAuthClick(): void {
    if (!this.tokenClient) return;

    this.tokenClient.callback = (response: any) => {
      this.handleAuthResponse(response);
    };

    if (!gapi.client.getToken()) {
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      this.tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  handleSignoutClick(): void {
    const token = gapi.client.getToken();
    if (token) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      console.log('Signed out');
    }
  }

  /**
   * Callback para manejar la respuesta de autenticación.
   */
  private handleAuthResponse(response: any): void {
    if (response.error) {
      console.error('Error during authentication:', response.error);
      return;
    }

    console.log('Successfully authenticated');
    // Puedes agregar lógica adicional aquí según tus necesidades.
    // Por ejemplo, redirigir al usuario a otra página:
    window.location.href = 'https://calculadora-de-ajustes.netlify.app/';
  }
}
