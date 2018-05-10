import { Component } from '@angular/core';
import { GalleryItemPage } from '../gallery-item/gallery-item';
import { LoginPage } from '../login/login';
import { NavController, LoadingController, NavParams, ModalController } from 'ionic-angular';
import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';



@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html'
})
export class GalleryPage {

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

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService
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

    if(!(this.posts.length > 0)){
      let loading = this.loadingCtrl.create();
      loading.present();

      this.wordpressService.getGallery(this.categoryId)
      .subscribe(data => {
        for(let post of data){
          //post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
          this.posts.push(post);
        }
        loading.dismiss();
      });
    }
  }

  postTapped(event, post) {
		let modal = this.modalCtrl.create(GalleryItemPage, {
      id: post.id,
      next:this.getNext.bind(this),
      prev:this.getPrev.bind(this)
    });
    modal.present();
  }

  doInfinite(infiniteScroll) {
    let page = (Math.ceil(this.posts.length/10)) + 1;
    let loading = true;

    this.wordpressService.getGallery(this.categoryId, page)
    .subscribe(data => {
      for(let post of data){
        if(!loading){
          infiniteScroll.complete();
        }
        //post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
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


  getThumbnail(post) {
    try {
      return post.better_featured_image.media_details.sizes.thumbnail.source_url; 
    } catch (e) {
      return undefined;
    }
  }

  getNext(post) {
    let i = this.posts.findIndex(p=>p.id==post.id)+1;
    i =  i>=this.posts.length ? this.posts.length-1 : i;
    return this.posts[i]; 
    
  }

  getPrev(post) {
    let i = this.posts.findIndex(p=>p.id==post.id)-1;
    i = i<0 ? 0 : i;
    return this.posts[i];
  }
}
