import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  index() {
    const viewData = [];
    viewData['currentTime'] = new Date();
    viewData['title'] = 'Home Page - Online Store';
    return { viewData };
  }

  @Get('/about')
  @Render('about')
  about() {
    const viewData = [];
    viewData['description'] = 'This is an about page ...';
    viewData['author'] = 'Your Name';
    viewData['title'] = 'About us - Online Store';
    viewData['subtitle'] = 'About us';
    return { viewData };
  }

  getHello(): string {
    return this.appService.getHello();
  }
}
