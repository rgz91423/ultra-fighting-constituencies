import { Component } from '@angular/core';

import { LoginPage } from '../login/login';
import { PostPage } from '../post/post';
import { HomePage } from '../home/home';
import { GalleryPage } from '../gallery/gallery';
import { CategoriesPage } from '../categories/categories';
import { GALLERY_CATEGORY_ID } from '../../config';
import { NOVEL_CATEGORY_ID } from '../../config';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  homePage = HomePage;
  galleryPage = GalleryPage;
  categoriesPage = CategoriesPage;
  //tab3Root = PostPage;

  novelParams = {
    id: NOVEL_CATEGORY_ID
  };
  galleryParams = {
    id: GALLERY_CATEGORY_ID
  };

  constructor() {

  }
}
