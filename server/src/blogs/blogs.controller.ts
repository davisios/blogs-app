import { BlogsService } from './blogs.service';
import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateBlogDto } from './dto/CreateBlog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  async createBlog(@Body() blog: CreateBlogDto): Promise<any> {
    return await this.blogsService.createBlog(blog);
  }

  @Get()
  async getBlogs(): Promise<any> {
    return await this.blogsService.getBlogs();
  }
}
