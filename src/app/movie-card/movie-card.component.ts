import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserRegistrationService } from '../fetch-api-data.service';
import { DescriptionComponent } from '../description/description.component';
import { DirectorComponent } from '../director/director.component';
import { GenreComponent } from '../genre/genre.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  FavoriteMovies: any[] = [];
  user: any[] = [];

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  getFavoriteMovies(): void {
    const username = localStorage.getItem('user');
    this.fetchApiData.getUser(username).subscribe((resp: any) => {
      this.FavoriteMovies = resp.FavoriteMovies;
      console.log(this.FavoriteMovies);
    });
  }

  showDescription(title: string, description: string): void {
    this.dialog.open(DescriptionComponent, {
      data: { title, description },
      width: "600px"
    });
  }

  showDirector(name: string, bio: string, birthday: Date): void {
    this.dialog.open(DirectorComponent, {
      data: { name, bio, birthday },
      width: "600px"
    });
  }

  showGenre(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: { name, description },
      width: "600px"
    });
  }

  addFavoriteMovie(_id: string): void {
    this.fetchApiData.addFavoriteMovie(_id).subscribe((resp: any) => {
      console.log(resp);
      // let favmovies = resp.FavoriteMovies;
      // localStorage.setItem('FavoriteMovies', favmovies);
      this.snackBar.open('The movie has been added to your favorites!', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    });
    return this.getFavoriteMovies();
  }

  removeFavoriteMovie(_id: string): void {
    this.fetchApiData.deleteMovie(_id).subscribe((resp: any) => {
      console.log(resp);
      this.snackBar.open('The movie has been removed from your favorites!', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    });
    return this.getFavoriteMovies();
  }

  isFavorite(_id: string): boolean {
    return this.FavoriteMovies.includes(_id);
  }

  toggleFavorite(movie: any): void {
    this.isFavorite(movie._id)
      ? this.removeFavoriteMovie(movie._id)
      : this.addFavoriteMovie(movie._id);
  }

}
