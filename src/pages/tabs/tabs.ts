import { Component } from '@angular/core';

import { LoginPage } from '../login/login';
import { PostPage } from '../post/post';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = LoginPage;
  tab3Root = PostPage;

  constructor() {

  }
}
