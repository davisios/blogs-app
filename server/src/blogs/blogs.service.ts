import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from 'src/models/Blog.schema';
import { Model } from 'mongoose';
import { CreateBlogDto } from './dto/CreateBlog.dto';
import { catchError, firstValueFrom } from 'rxjs';
import {
  AlgoliaBlog,
  AlgoliaSearchResponse,
} from 'src/models/AlgoliaSearchResponse';
import { AxiosError } from 'axios';
import { UpdateBlogDto } from './dto/updateBlogDto';
import mongoose from 'mongoose';

@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Blog.name) private BlogModel: Model<Blog>,
  ) {}

  async createBlog(blog: CreateBlogDto): Promise<Blog> {
    const newBlog = new this.BlogModel(blog);
    return newBlog.save();
  }

  async deleteBlog(id: string): Promise<void> {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (isValid) return this.BlogModel.findByIdAndDelete(id);
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
