import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { GetAllMoviesService } from '../fetch-api-data.service';
import { DescriptionComponent } from '../description/description.component';
import { DirectorComponent } from '../director/director.component';
import { GenreComponent } from '../genre/genre.component';

import { AddMovieService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];

  constructor(
    public fetchApiData: GetAllMoviesService,
    public fetchApiDataAddFavMov: AddMovieService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
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

  addFavorite(_id: string, title: string): void {
    this.fetchApiDataAddFavMov.addMovie(_id).subscribe((resp: any) => {
      let favmovies = resp.FavoriteMovies;
      localStorage.setItem('FavoriteMovies', favmovies);
      this.snackBar.open(`${title} has been added to your favorites!`, 'OK', {
        duration: 2000,
      });
    });
  }
}
