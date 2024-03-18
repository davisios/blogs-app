import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from 'src/models/Blog.schema';
import { Model } from 'mongoose';
import { CreateBlogDto } from './dto/CreateBlog.dto';
import { catchError, firstValueFrom, last } from 'rxjs';
import {
  AlgoliaBlog,
  AlgoliaSearchResponse,
} from 'src/models/AlgoliaSearchResponse';
import { AxiosError } from 'axios';

@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Blog.name) private BlogModel: Model<Blog>,
  ) {}
  async createBlog(blog: CreateBlogDto): Promise<any> {
    const newBlog = new this.BlogModel(blog);
    return newBlog.save();
  }

  async getBlogs(): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<AlgoliaSearchResponse>(
          'https://hn.algolia.com/api/v1/search_by_date?query=nodejs',
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    const hits: AlgoliaBlog[] = data.hits;
    const currentBlogs = await this.BlogModel.find().sort({
      created_at: 'desc',
    });
    if (!hits.length) {
      return currentBlogs;
    }
    const lastBlog: AlgoliaBlog = hits[0];
    const currentLastBlog: CreateBlogDto = currentBlogs[0];
    if (currentLastBlog.objectID !== lastBlog.objectID) {
      const newBlog = new this.BlogModel({
        ...lastBlog,
        story_text: lastBlog._highlightResult.story_text.value,
      });
      await this.createBlog(newBlog);
    }
    return this.BlogModel.find().sort({ created_at: 'desc' });
  }
}
