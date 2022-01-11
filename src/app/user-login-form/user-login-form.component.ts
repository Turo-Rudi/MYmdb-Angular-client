import { Component, OnInit, Input } from '@angular/core';
//closes the dialog on success
import { MatDialogRef } from '@angular/material/dialog';
//brings in the API calls
import { FetchApiDataService } from '../fetch-api-data.service';
//displays notifications to the user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {

  userCredentials = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  loginUser(): void {
    this.fetchApiData.userLogin(this.userCredentials).subscribe((response) => {
      //logic for successful user login
      this.dialogRef.close(); //close the modal on success
      localStorage.setItem('user', response.user.Username);
      localStorage.setItem('token', response.token);
      console.log(response);
      this.snackBar.open('User logged in successfully!', 'OK', {
        duration: 2000
      });
    }, (response) => {
      console.log(response);
      this.snackBar.open(response, 'OK', {
        duration: 2000
      });
    });
  }
}