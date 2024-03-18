import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './blogs/blogs.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb://mongo_db_blog:27017/blogs?authSource=admin',
    ),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    BlogsModule,
  ],
  providers: [],
})
export class AppModule {}
