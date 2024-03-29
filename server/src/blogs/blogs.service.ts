import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBlogDto } from './dto/CreateBlog.dto';
import { catchError, firstValueFrom } from 'rxjs';
import {
  AlgoliaBlog,
  AlgoliaSearchResponse,
} from './models/AlgoliaSearchResponse';
import { AxiosError } from 'axios';
import { UpdateBlogDto } from './dto/updateBlogDto';
import mongoose from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { Blog } from './schemas/Blog.schema';

@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Blog.name) private BlogModel: Model<Blog>,
  ) {}

  @Cron('0 * * * *')
  handleHourlyTask() {
    this.getBlogs();
  }

  async createBlog(blog: CreateBlogDto): Promise<Blog> {
    return this.BlogModel.create({ ...blog, valid: true });
  }

  async deleteBlog(id: string): Promise<void> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (isValid) return this.BlogModel.findByIdAndUpdate(id, { valid: false });
    throw new HttpException('invalid id', 400);
  }

  async updateBlog(id: string, blog: UpdateBlogDto): Promise<Blog> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (isValid)
      return this.BlogModel.findByIdAndUpdate(id, blog, { new: true });
    throw new HttpException('invalid id', 400);
  }

  async getBlogById(id: string): Promise<Blog> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (isValid) return this.BlogModel.findById(id);
    throw new HttpException('invalid id', 400);
  }

  async getRemoteBlogs(): Promise<AlgoliaBlog[]> {
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
    return data.hits?.length ? data.hits : [];
  }

  async getBlogs(): Promise<Blog[]> {
    const blogs: AlgoliaBlog[] = await this.getRemoteBlogs();
    const currentBlogs = await this.BlogModel.find().sort({
      created_at: 'desc',
    });

    if (!blogs.length) {
      return currentBlogs;
    }
    const lastBlog: AlgoliaBlog = blogs[0];
    const title =
      lastBlog._highlightResult?.story_title?.value || lastBlog.title;
    const story_url = lastBlog.story_url;
    const currentLastBlog: CreateBlogDto = currentBlogs[0];
    if (currentLastBlog?.objectID !== lastBlog.objectID) {
      await this.createBlog({
        ...lastBlog,
        title,
        story_url,
      });
    }
    return this.BlogModel.find().sort({ created_at: 'desc' });
  }
}
