import { Component, NgZone } from '@angular/core';
import { PostPage } from '../post/post';
import { LoginPage } from '../login/login';
import { NavController, LoadingController, NavParams, ModalController } from 'ionic-angular';
import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';
import * as Config from '../../config';
//import { ShrinkingSegmentHeader } from '../../components/shrinking-segment-header/shrinking-segment-header';


@Component({
  selector: 'page-posts',
  templateUrl: 'posts.html'
})
export class PostsPage {

  scrollDirection: string;
  /*
  tab1Root = PostPage;
  tab2Root = PostPage;
  tab3Root = PostPage;
  */

	posts: Array<any> = new Array<any>();
  morePagesAvailable: boolean = true;
  loggedUser: boolean = false;

  categoryId: number;
  categoryTitle: string;

  category: any;



  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService,
    private zone: NgZone
  ) {}

  ionViewWillEnter() {
    this.authenticationService.getUser()
    .then(
      data => this.loggedUser = true,
      error => this.loggedUser = false
    );
    this.morePagesAvailable = true;

    //if we are browsing a category
    this.categoryId = this.navParams.get('id');
    this.categoryTitle = this.navParams.get('title');

    this.getCategory();

    if(!(this.posts.length > 0)){
      let loading = this.loadingCtrl.create();
      loading.present();

      this.wordpressService.getPosts(this.categoryId)
      .subscribe(data => {
        for(let post of data){
          //post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
          this.posts.push(post);
        }
        loading.dismiss();
      });
    }
  }

  postTapped(event, index) {
		/*this.navCtrl.push(PostPage, {
      id: post.id,
      next:this.getNext.bind(this),
      prev:this.getPrev.bind(this)
    });*/
    
   let postModal = this.modalCtrl.create(PostPage,  {
      posts: this.posts,
      index: index,
      category: this.categoryId
    });
    postModal.present();
    postModal.onDidDismiss(data => {
      console.log(data);
      this.posts = data;
    });

  }

  doInfinite(infiniteScroll) {
    let page = (Math.ceil(this.posts.length/Config.QUERY_SIZE)) + 1;
    let loading = true;

    this.wordpressService.getPosts(this.categoryId, page)
    .subscribe(data => {
      for(let post of data){
        if(!loading){
          infiniteScroll.complete();
        }
       // post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
        this.posts.push(post);
        loading = false;
      }
    }, err => {
      this.morePagesAvailable = false;
    })
  }

  logOut(){
    this.authenticationService.logOut()
    .then(
      res => this.navCtrl.push(LoginPage),
      err => console.log('Error in log out')
    )
  }

  goToLogin(){
    this.navCtrl.push(LoginPage);
  }

 

  getCategory() {
   
    this.wordpressService.getCategory(this.categoryId)
    .subscribe(data => {
        this.category = data;
    })
  }



  scrollHandler(ev) {


    this.zone.run(() => {
      
      if (ev.directionY=="up") {
        this.scrollDirection = "up";
      } else if (ev.directionY=="down") {
        this.scrollDirection = "down";
      }

      console.log("writed " + this.scrollDirection);
 
   });
 
  }


}
