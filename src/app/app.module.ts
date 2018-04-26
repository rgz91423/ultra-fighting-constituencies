import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { PostPage } from '../pages/post/post';
import { PostsPage } from '../pages/posts/posts';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { GalleryPage } from '../pages/gallery/gallery';
import { CategoriesPage } from '../pages/categories/categories';


import { WordpressService } from '../services/wordpress.service';
import { AuthenticationService } from '../services/authentication.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';

import { NavController } from 'ionic-angular';

@NgModule({
  declarations: [
    MyApp,
    PostPage,
    PostsPage,
    HomePage,
    GalleryPage,
    LoginPage,
    CategoriesPage,
    RegisterPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PostPage,
    PostsPage,
    HomePage,
    LoginPage,
    CategoriesPage,
    RegisterPage,
    GalleryPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    WordpressService,
    AuthenticationService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}


