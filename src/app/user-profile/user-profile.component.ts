import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { UserRegistrationService, User } from '../fetch-api-data.service';
import { UserUpdateComponent } from '../user-update/user-update.component';
import { MovieCardComponent } from '../movie-card/movie-card.component';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  Username = localStorage.getItem('user');
  movies: any = [];
  FavMovies: any = [];
  Email: any = [];
  Birthday: any = [];

  constructor(
    public fetchApiData: UserRegistrationService,
    public router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getMovies();
  }

  getUser(): void {
    const username = localStorage.getItem('user');
    this.fetchApiData.getUser(username).subscribe((res: any) => {
      this.user = res;
      this.getMovies();
    });
  }

  // getUser(): void {
  //   let FavoriteMovies = localStorage.getItem('FavoriteMovies');
  //   let Username = localStorage.getItem('user');
  //   let Email = localStorage.getItem('Email');
  //   let Birthday = localStorage.getItem('Birthday');
  //   this.fetchApiData.getUser(user).subscribe((res: any) => {
  //     this.user = res;
  //     this.getMovies();
  //     console.log(res);
  //   });
  // }

  getMovies(): void {
    const username = localStorage.getItem('user');
    this.fetchApiData.getUser(username).subscribe((resp: any) => {
      this.FavMovies = resp.FavoriteMovies;
      console.log(this.FavMovies);
      return this.FavMovies;
    });
  }

  removeFavorites(_id: string, title: string): void {
    this.fetchApiData.deleteMovie(_id).subscribe((resp: any) => {
      console.log(resp);
      // let favmovies = resp.FavoriteMovies;
      // localStorage.setItem('FavoriteMovies', favmovies);
      this.snackBar.open(
        `${title} has been removed from your favorites!`,
        `OK`, {
        duration: 2000,
      }
      );
    });
    setTimeout(function () {
      window.location.reload();
    }, 1000);
  }

  profileUpdateDialog(): void {
    this.dialog.open(UserUpdateComponent, {
    });
  }

  deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['welcome']);
      this.snackBar.open('Your profile has been deleted', 'OK', {
        duration: 2000,
      });
    });
  }

  //opens the dialog when the all movies button is clicked
  openMoviesDialog(): void {
    this.dialog.open(MovieCardComponent, {
      width: '500px'
    });
  }
}
