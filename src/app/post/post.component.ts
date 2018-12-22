import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() postTitle:String;
  @Input() postContent:String;
  @Input() postLoveIts:number;
  @Input() postCreated_at:Date;
 

  constructor() { }

  ngOnInit() {
  }

 onLike(){
   this.postLoveIts = this.postLoveIts+1;
   console.log(this.postLoveIts);

 }

 onDislike(){ 
    return this.postLoveIts--; 
 }

}
