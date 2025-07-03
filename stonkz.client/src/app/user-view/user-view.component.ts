import { Component, inject} from '@angular/core';
import { UserDataService } from '../user-data.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      user-view works! Welcome, {{userData.userName}}!
    </p>
    <p>Account Balance: {{userData.accountBalance}} €</p>
    <p>current GameDay: {{userData.gameDay | date:'shortDate'}}</p>
  `,
  styles: ``
})
export class UserViewComponent  {

  userData = inject(UserDataService);

  
  
}
