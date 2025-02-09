import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private auth: AuthService) { }

  /**
 * @function onClick
 * @description Metodo para poder desloguear
 */
  onClick() {
    this.auth.logout();
  }

  ngOnInit() { }
}
