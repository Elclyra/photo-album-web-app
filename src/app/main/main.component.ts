import { Component, OnInit, Input} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent {

  @Input() nameList:any = []

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
