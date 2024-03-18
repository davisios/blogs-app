import { BlogsService } from './blogs.service';
import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/CreateBlog.dto';
import { UpdateBlogDto } from './dto/updateBlogDto';
import { Blog } from './schemas/Blog.schema';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createBlog(@Body() blog: CreateBlogDto): Promise<Blog> {
    return this.blogsService.createBlog(blog);
  }

  @Get()
  getBlogs(): Promise<Blog[]> {
    return this.blogsService.getBlogs();
  }

  @Get(':id')
  getBlogById(@Param('id') id: string): Promise<Blog> {
    return this.blogsService.getBlogById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateBlog(
    @Param('id') id: string,
    @Body()
    blog: UpdateBlogDto,
  ): Promise<Blog> {
    return this.blogsService.updateBlog(id, blog);
  }

  @Delete(':id')
  deleteBlog(@Param('id') id: string): Promise<void> {
    return this.blogsService.deleteBlog(id);
  }
}
