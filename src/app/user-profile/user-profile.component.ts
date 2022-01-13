import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetAllMoviesService } from '../fetch-api-data.service';
import { DeleteUserService } from '../fetch-api-data.service';
import { DeleteMovieService } from '../fetch-api-data.service';
import { UserUpdateComponent } from '../user-update/user-update.component';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  movies: any = [];
  favorite: any = [];
  Email: any = [];
  Birthday: any = [];

  constructor(
    public fetchApiData: GetAllMoviesService,
    public fetchApiDataDeleteMovie: DeleteMovieService,
    public fetchApiDataDeleteUser: DeleteUserService,
    public router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    let FavoriteMovies = localStorage.getItem('FavoriteMovies');
    let Username = localStorage.getItem('user');
    let Email = localStorage.getItem('Email');
    let Birthday = localStorage.getItem('Birthday');
    this.user = {
      "FavoriteMovies": FavoriteMovies,
      "Username": Username,
      "Email": Email,
      "Birthday": Birthday,
    }
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.filterFavorites();
    });
  }

  filterFavorites(): void {
    this.movies.forEach((movie: any) => {
      if (this.user.FavoriteMovies.includes(movie._id)) {
        this.favorite.push(movie);
      }
    });
    return this.favorite;
  }

  removeFavorites(_id: string, title: string): void {
    this.fetchApiDataDeleteMovie.deleteMovie(_id).subscribe((resp) => {
      console.log(resp);
      let favmovies = resp.FavoriteMovies;
      localStorage.setItem('FavoriteMovies', favmovies);
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
    this.fetchApiDataDeleteUser.deleteUser().subscribe(() => {
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
