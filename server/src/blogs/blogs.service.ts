import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from 'src/models/Blog.schema';
import { Model } from 'mongoose';
import { CreateBlogDto } from './dto/CreateBlog.dto';

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
    // async getBlogs(): Promise<AlgoliaSearchResponse> {
    // const { data } = await firstValueFrom(
    //   this.httpService
    //     .get<AlgoliaSearchResponse>(
    //       'https://hn.algolia.com/api/v1/search_by_date?query=nodejs',
    //     )
    //     .pipe(
    //       catchError((error: AxiosError) => {
    //         this.logger.error(error.response.data);
    //         throw 'An error happened!';
    //       }),
    //     ),
    // );
    // const hits: AlgoliaBlog[] = data.hits;
    // //TODO get all db blogs latest dbhit
    // //if does not match the id of the last hit then insert it

    return [];
  }
}
