import { Component, ViewChild } from '@angular/core';
import { NavParams, NavController, LoadingController, AlertController, Slides, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from "rxjs/Observable";
import * as Config from '../../config';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {

  @ViewChild(Slides) slides: Slides;

  //post: any;

  posts: Array<any> = new Array<any>();
  postId: number;
  categoryId: number;
  index:number;

  user: string;
  categories: Array<any> = new Array<any>();
  morePagesAvailable: boolean = true;
  


  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService
  ) {
    this.morePagesAvailable = true;
    let loading = this.loadingCtrl.create();

    //loading.present();

    //this.post = this.navParams.get('item');
    //this.postId = this.navParams.get('id');
    this.posts  = this.navParams.get('posts');
    this.categoryId = this.navParams.get('category');
    this.index = +this.navParams.get('index');
  }

  ionViewWillEnter(){
   
   
    /*
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
   */
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

  getDetail(){


    let theIndex = this.slides.getActiveIndex() || this.index;
    let post = this.posts[theIndex];
    console.log(theIndex+" " + post);
   

    let loading = this.loadingCtrl.create();
    if(!post || !post.detailed){
      loading.present();

      this.wordpressService.getPost(post.id)
      .subscribe(data => {
          post = data;
          post.detailed=true;
          this.posts[theIndex] = post;
          console.log(post);
          
          //loading.dismiss();
          this.getCategories(post).subscribe(cats=>{
            post.categories = cats;
            this.slides.update();
            loading.dismiss();
          });
      });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss(this.posts);
  }

  getAuthorData(post){
    return this.wordpressService.getAuthor(post.author);
  }

  getCategories(post){
    return this.wordpressService.getPostCategories(post);
  }

  getComments(post){
    return this.wordpressService.getComments(post.id);
  }

  

  loadMoreComments(post, infiniteScroll) {
    let page = (post.comments.length/10) + 1;
    this.wordpressService.getComments(post.id, page)
    .subscribe(data => {
      for(let item of data){
        post.comments.push(item);
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



  doInfinite() {


    let page = (Math.ceil(this.posts.length/Config.QUERY_SIZE)) + 1;
    let loading = this.loadingCtrl.create();
      loading.present();

    this.wordpressService.getPosts(this.categoryId, page)
    .subscribe(data => {
      for(let post of data){
        loading.dismiss();
       // post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
        this.posts.push(post);
      }

    }, err => {
      this.morePagesAvailable = false;
      loading.dismiss();
    })
  }

getNext(){
  this.slides.slideNext();
}

getPrev(){
  this.slides.slidePrev();
}



  createComment(post){
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
            this.wordpressService.createComment(post.id, user, data.comment)
            .subscribe(
              (data) => {
                console.log("ok", data);
                this.getComments(post);
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
