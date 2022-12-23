import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  nameList:any = []

  usersUrl = "https://jsonplaceholder.typicode.com/users/";


  ngOnInit(): void {
    this.fetchData();
  }


  constructor(private http: HttpClient){}

  private fetchData(){
    this.http.get(this.usersUrl)
    .pipe(map((res: any) => {
      const data = [];
      for(const key in res){
        this.nameList.push(res[key].name)
      }
    }))
    .subscribe(() => {
    })
  }

}
