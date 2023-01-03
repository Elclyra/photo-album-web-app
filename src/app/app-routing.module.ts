import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumsComponent } from './albums/albums.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'albums/:id/:name',
    component: AlbumsComponent
  },
  { path: '', 
    component: MainComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
