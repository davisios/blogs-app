import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/blogs'),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    BlogsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
