import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class AlbumsComponent implements OnInit {
  albumId = 1;
  imageId = 1;
  selectedAlbum = 1
  albumsCreated = 0;
  albumsDeleted = 0;
  userId = window.location.pathname.split('/')[2];
  userName = window.location.pathname.split('/')[3].split('%20').join(' ')
  albumsList: any = []
  albums:any = {}

  currentImg:any = "";
  currentCustomImg:any = "";

  albumsUrl = "https://jsonplaceholder.typicode.com/users/"+this.userId+"/albums";


  ngOnInit(): void {
    this.fetchAlbums();
  }


  constructor(private http: HttpClient){}

  private fetchAlbums(){
    this.http.get(this.albumsUrl)
    .pipe(map((res: any) => {
      for(const key in res){
        this.albums[res[key].id] = res[key].title
      }
    }))
    .subscribe(() => {
      this.albumsList = Object.values(this.albums)
      for(let i = 1; i <= this.albumsList.length; i++){
        this.fetchImages(i)
      }  
      
    })
  }

  private fetchImages(album:number){
    let imagesUrl = "https://jsonplaceholder.typicode.com/albums/"+album+"/photos";
    this.http.get(imagesUrl)
    .pipe(map((res: any) => { 
      for(const key in res){
        let images:any = document.getElementById('images-'+ album) 
        images.innerHTML += `<a><img data-bs-toggle="modal" data-bs-target="#imgModal" src="${res[key].thumbnailUrl}" class="image-item" id="image-${res[key].id}"><img class="image-removal" src="/assets/images/trash.svg"></a>`;
      }
    }))
    .subscribe(() => {
      if(this.selectedAlbum == this.albumsList.length){
        this.addImageRemoval(false)
        console.log("Images are loaded")
      }
      this.selectedAlbum++
    })
  }

  public addAlbum(){
    let inputAlbumTitle = (<HTMLInputElement>document.getElementById('form-album-title')).value
    this.albumsList.push(inputAlbumTitle);
    this.albumsCreated++;
    this.addLog('album-created')
  }

  public addImages(){
    let inputAlbumId = (<HTMLInputElement>document.getElementById('form-select-album')).value
    let inputImageSource = (<HTMLInputElement>document.getElementById('form-image-source')).value
    let seletedAlbum = document.getElementById(inputAlbumId)
    let images:any = seletedAlbum?.querySelector('.images')
    if(inputImageSource !== ''){
      images.innerHTML += `<a><img data-bs-toggle="modal" data-bs-target="#customImgModal" src="${inputImageSource}" class="custom-image-item" id="image-custom-${this.imageId}"><img class="custom-image-removal" src="/assets/images/trash.svg"></a>`;
      this.addImageRemoval(true);
      this.imageId++;
      this.addLog('image-created')
    }
  }

  public addImageRemoval(isCustom:boolean){
    if(isCustom){
      document.querySelectorAll('.custom-image-removal').forEach(item =>{
        let selected:any = item;
        selected.removeAllListeners()
        item.addEventListener('click', (e:any) =>{
          item.parentElement?.remove();
          this.addLog('image-deleted')
        })
      })
      document.querySelectorAll('.custom-image-item').forEach(item =>{
        item.addEventListener('click', (e:any) =>{
          this.currentCustomImg = item.getAttribute('src')
        })
      })
      document.querySelectorAll('.image-item').forEach(item =>{
        item.addEventListener('click', (e:any) =>{
          let splitImage:any = item.getAttribute('src')?.split('/');
          splitImage[3] = '600';
          this.currentImg = splitImage.join('/')
        })
      })
      document.querySelectorAll('.image-removal').forEach(item =>{
        let selected:any = item;
        selected.removeAllListeners()
        
        item.addEventListener('click', (e:any) =>{
          item.parentElement?.remove();
          this.addLog('image-deleted')
        })
      })
    }
    else{
      document.querySelectorAll('.image-removal').forEach(item =>{
        item.addEventListener('click', (e:any) =>{
          item.parentElement?.remove();
          this.addLog('image-deleted')
        })
      })
      document.querySelectorAll('.image-item').forEach(item =>{
        item.addEventListener('click', (e:any) =>{
          let splitImage:any = item.getAttribute('src')?.split('/');
          splitImage[3] = '600';
          this.currentImg = splitImage.join('/')
        })
      })
    }
  }

  public showImages(albumId:any){
    document.getElementById("images-"+albumId)?.classList.toggle('hidden');
  }
  public addLog(action:any){
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();  
    let actionDesc = "";
    let actionLog:any = document.getElementById("action-log");
    switch (action){
      case 'album-created':
        actionDesc = "created an album"
        break;
      case 'album-deleted':
        actionDesc = "deleted an album"
        break;
      case 'image-deleted':
        actionDesc = "deleted a picture"
        break;
      case 'image-created':
        actionDesc = "created a picture"
        break;
    }
    actionLog.innerHTML += `<p>${time} ${this.userName} ${actionDesc}</p>`
  }

}
