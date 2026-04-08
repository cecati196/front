import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-auth-callback',
  template: `<p style="text-align:center; margin-top: 4rem;">Iniciando sesión...</p>`,
})
export class AuthCallbackComponent implements OnInit {
  constructor(private auth: AuthService) {}

  async ngOnInit(): Promise<void> {
    await this.auth.handleCallback();
  }
}
