import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

const authConfig: AuthConfig = {
  issuer: 'https://id-test.trueconnect.vn',
  clientId: 'localhost_identity_short',
  responseType: 'code',
  dummyClientSecret: 'no_important',
  redirectUri: 'http://localhost:4200',
  scope: 'openid profile email offline_access',
  timeoutFactor: 0.6,
  clearHashAfterLogin: false,
  strictDiscoveryDocumentValidation: false,
  oidc: false,
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'OIDC';
  constructor(private readonly OAuth: OAuthService) {
    this.OAuth.configure(authConfig);
    this.OAuth.setStorage(localStorage);
    this.OAuth.loadDiscoveryDocument().then(() => {
      this.OAuth.tryLoginImplicitFlow().then(() => {
        if (!this.OAuth.hasValidAccessToken()) {
          return this.OAuth.tryLoginCodeFlow().then(() => {
            return Promise.resolve();
          });
        } else {
          return this.OAuth.loadUserProfile().then(() => {
            return Promise.resolve();
          });
        }
      });
    });

    window.addEventListener('storage', (event) => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn(
        'Noticed changes to access_token (most likely from another tab), updating isAuthenticated'
      );
      if (!this.OAuth.hasValidAccessToken()) {
        alert('delete token');
      }
    });
  }
  login() {
    this.OAuth.initImplicitFlow();
  }
  getToken() {
    console.log(this.OAuth.getAccessToken());
  }
  refreshToken() {
    this.OAuth.refreshToken();
  }
}
