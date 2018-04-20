import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthenticationService } from '../services/authentication.service';
import { TabsPage } from '../pages/tabs/tabs';
import { NavController, LoadingController, NavParams } from 'ionic-angular';

import { App, MenuController } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;

  constructor(
   /* public navCtrl: NavController,
    public navParams: NavParams,*/
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    authenticationService: AuthenticationService,
    menu: MenuController
  ) {
    menu.enable(true);

    platform.ready().then(() => {
      authenticationService.getUser()
      .then(
        data => {
          authenticationService.validateAuthToken(data.token)
          .subscribe(
            res => this.rootPage = HomePage,
            err =>   this.rootPage = LoginPage
          )
        },
        err => this.rootPage = LoginPage
      );
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }


  goToCategoryPosts(categoryId, categoryTitle){
    /*this.navCtrl.push(HomePage, {
      id: categoryId,
      title: categoryTitle
    })*/
    this.nav.setRoot(HomePage,{
      id: categoryId,
      title: categoryTitle
    });

  }

  

}
