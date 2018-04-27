import { Component } from '@angular/core';
import { PostPage } from '../post/post';
import { LoginPage } from '../login/login';
import { PostsPage } from '../posts/posts';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';



@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage {

  /*
  tab1Root = PostPage;
  tab2Root = PostPage;
  tab3Root = PostPage;
  */

	categories: Array<any> = new Array<any>();
  morePagesAvailable: boolean = true;
  loggedUser: boolean = false;

  categoryId: number;
  categoryTitle: string;

  constructor(
    public navCtrl: NavController,
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

    if(!(this.categories.length > 0)){
      let loading = this.loadingCtrl.create();
      loading.present();

      this.wordpressService.getCategories(this.categoryId, 1, "asc","slug")
      .subscribe(data => {
        for(let category of data){
          //post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
          this.categories.push(category);
        }
        loading.dismiss();
      });
    }
  }

  postTapped(event, post) {
		this.navCtrl.push(PostPage, {
		  item: post
		});
  }

  doInfinite(infiniteScroll) {
    let page = (Math.ceil(this.categories.length/10)) + 1;
    let loading = true;

    this.wordpressService.getCategories(this.categoryId, page, "asc","slug")
    .subscribe(data => {
      for(let category of data){
        if(!loading){
          infiniteScroll.complete();
        }
       // post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
        this.categories.push(category);
        loading = false;
      }
    }, err => {
      this.morePagesAvailable = false;
    })
  }

  goToCategoryPosts(categoryId, categoryTitle){
    /*this.navCtrl.push(HomePage, {
      id: categoryId,
      title: categoryTitle
    })*/
    this.navCtrl.push(PostsPage,{
      id: categoryId,
      title: categoryTitle
    });

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
}
