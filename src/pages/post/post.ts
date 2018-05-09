import { Component } from '@angular/core';
import { NavParams, NavController, LoadingController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {

  post: any;
  postId: number;
  categoryId: number;
  user: string;
  comments: Array<any> = new Array<any>();
  categories: Array<any> = new Array<any>();
  morePagesAvailable: boolean = true;
  prev:any;
  next:any;

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService
  ) {

  }

  ionViewWillEnter(){
    this.morePagesAvailable = true;
    let loading = this.loadingCtrl.create();

    //loading.present();

    this.post = this.navParams.get('item');
    this.postId = this.navParams.get('id');
    this.categoryId = this.navParams.get('category');

    this.prev = this.navParams.get('prev');
    this.next = this.navParams.get('next');
   
      if(!(this.post)){
        loading.present();

        this.wordpressService.getPost(this.postId)
        .subscribe(data => {
            this.post = data;
            //loading.dismiss();
            this.getCategories().subscribe(cats=>{
              this.categories = cats;
              loading.dismiss();
            });
        });
      }
   
     // console.log("prev ctrl:");
     // console.log(this.navCtrl.getPrevious().component.postList);
      
    /*
    Observable.forkJoin(
      this.getAuthorData(),
      this.getCategories(),
      this.getComments())
      .subscribe(data => {
        this.user = data[0].name;
        this.categories = data[1];
        this.comments = data[2];
        loading.dismiss();
      });
      */
  }

  swipeEvent(e) {
    console.log(e.direction);
    if (e.direction == 2) {
      this.getPrev();
    } else if (e.direction == 4) {
      this.getNext();
    }
  }

  getAuthorData(){
    return this.wordpressService.getAuthor(this.post.author);
  }

  getCategories(){
    return this.wordpressService.getPostCategories(this.post);
  }

  getComments(){
    return this.wordpressService.getComments(this.post.id);
  }

  getPrev() {
    this.navCtrl.push(PostPage,{
      id: this.prev(this.post).id,
      next:this.next.bind(this),
      prev:this.prev.bind(this)
    },{animate: true, direction: "back"});
  }


  getNext() {
    
    this.navCtrl.push(PostPage,{
      id: this.next(this.post).id,
      next:this.next.bind(this),
      prev:this.prev.bind(this)
    },{animate: true, direction: "forward"});
      
   
  }


  loadMoreComments(infiniteScroll) {
    let page = (this.comments.length/10) + 1;
    this.wordpressService.getComments(this.post.id, page)
    .subscribe(data => {
      for(let item of data){
        this.comments.push(item);
      }
      infiniteScroll.complete();
    }, err => {
      console.log(err);
      this.morePagesAvailable = false;
    })
  }

  goToCategoryPosts(categoryId, categoryTitle){
    this.navCtrl.push(HomePage, {
      id: categoryId,
      title: categoryTitle
    })
  }

  createComment(){
    let user: any;

    this.authenticationService.getUser()
    .then(res => {
      user = res;

      let alert = this.alertCtrl.create({
      title: 'Add a comment',
      inputs: [
        {
          name: 'comment',
          placeholder: 'Comment'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Accept',
          handler: data => {
            let loading = this.loadingCtrl.create();
            loading.present();
            this.wordpressService.createComment(this.post.id, user, data.comment)
            .subscribe(
              (data) => {
                console.log("ok", data);
                this.getComments();
                loading.dismiss();
              },
              (err) => {
                console.log("err", err);
                loading.dismiss();
              }
            );
          }
        }
      ]
    });
    alert.present();
    },
    err => {
      let alert = this.alertCtrl.create({
        title: 'Please login',
        message: 'You need to login in order to comment',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Login',
            handler: () => {
              this.navCtrl.push(LoginPage);
            }
          }
        ]
      });
    alert.present();
    });
  }
}
