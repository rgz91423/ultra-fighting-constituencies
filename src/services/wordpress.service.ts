import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import * as Config from '../config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class WordpressService {
  constructor(public http: Http){}

  getRecentPosts(categoryId:number, page:number = 1){
    //if we want to query posts by category
    let category_url = categoryId? ("&categories=" + categoryId): "";

    return this.http.get(
      Config.WORDPRESS_REST_API_URL
      + 'posts?page=' + page
      + '&per_page=' + Config.QUERY_SIZE
      + '&fields=id,title.rendered'
      + category_url)
    .map(res => res.json());
  }

  getComments(postId:number, page:number = 1){
    return this.http.get(
      Config.WORDPRESS_REST_API_URL
      + "comments?post=" + postId
      + '&page=' + page)
    .map(res => res.json());
  }

  getAuthor(author){
    return this.http.get(Config.WORDPRESS_REST_API_URL + "users/" + author)
    .map(res => res.json());
  }

  getPostCategories(post){
    let observableBatch = [];

    post.categories.forEach(category => {
      observableBatch.push(this.getCategory(category));
    });

    return Observable.forkJoin(observableBatch);
  }

  getCategory(categoryId:number){
    return this.http.get(Config.WORDPRESS_REST_API_URL + "categories/" + categoryId)
    .map(res => res.json());
  }

  getCategories(categoryId:number, page:number = 1,order:string="desc", orderby:string = "slug") {
    return this.http.get(Config.WORDPRESS_REST_API_URL + "categories?orderby=" + orderby + "&order=" + order + "&page=" + page + (categoryId ? "&parent=" + categoryId : ""))
    .map(res => res.json());
  }


  getPosts(categoryId:number, page:number = 1){
    //if we want to query posts by category
    let category_url = categoryId? ("&categories=" + categoryId): "";

    return this.http.get(
      Config.WORDPRESS_REST_API_URL
      + 'posts?page=' + page
      + '&per_page=' + Config.QUERY_SIZE_BIG
      + '&fields=id,title.rendered'
      + '&order=asc'
      + category_url)
    .map(res => res.json());
  }

  getPost(postId){
    return this.http.get(Config.WORDPRESS_REST_API_URL + "posts/" + postId)
    .map(res => res.json());
  }

  getGallery(categoryId:number, page:number = 1){
    //if we want to query posts by category
    let category_url = categoryId? ("&categories=" + categoryId): "";

    return this.http.get(
      Config.WORDPRESS_REST_API_URL
      + 'posts?page=' + page
      + '&per_page=' + Config.QUERY_SIZE
     // + '&fields=id,title.rendered,featured_media,_links'
      + category_url)
    .map(res => res.json());
  }

  createComment(postId, user, comment){
    let header: Headers = new Headers();
    header.append('Authorization', 'Bearer ' + user.token);

    return this.http.post(Config.WORDPRESS_REST_API_URL + "comments?token=" + user.token, {
      author_name: user.displayname,
      author_email: user.email,
      post: postId,
      content: comment
    },{ headers: header })
    .map(res => res.json());
  }
}
