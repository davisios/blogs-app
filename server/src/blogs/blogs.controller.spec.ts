import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/CreateBlog.dto';
import { Blog } from '../models/Blog.schema';
import { getModelToken } from '@nestjs/mongoose';
import { UpdateBlogDto } from './dto/updateBlogDto';

describe('BlogsController', () => {
  let controller: BlogsController;
  let service: BlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogsController],
      providers: [
        BlogsService,
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: getModelToken(Blog.name),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<BlogsController>(BlogsController);
    service = module.get<BlogsService>(BlogsService);
  });

  it('should return a blog by ID', async () => {
    const id = 'example_id';
    const blog: Blog = {
      created_at: '2021-03-11T21:38:36Z',
      objectID: '1',
      title: 'Example Blog Title',
      valid: true,
      author: 'John Doe',
      story_url: 'some story',
    };

    jest.spyOn(service, 'getBlogById').mockResolvedValue(blog);
    const result = await controller.getBlogById(id);
    expect(result).toEqual(blog);
  });

  it('should return an array of blogs', async () => {
    const blogs: Blog[] = [
      {
        created_at: '2021-03-11T21:38:36Z',
        objectID: '1',
        title: 'Example Blog Title',
        author: 'John Doe',
        story_url: 'some story',
        valid: true,
      },
      {
        created_at: '2021-03-11T21:38:36Z',
        objectID: '2',
        title: 'Example Blog Title 2',
        author: 'Jane Doe',
        story_url: 'some story',
        valid: true,
      },
    ];

    jest.spyOn(service, 'getBlogs').mockResolvedValue(blogs);
    const result = await controller.getBlogs();
    expect(result).toEqual(blogs);
  });

  it('should delete a blog by ID', async () => {
    const id = '1';
    jest.spyOn(service, 'deleteBlog').mockResolvedValue(undefined);
    const result = await controller.deleteBlog(id);
    expect(result).toBeUndefined();
  });

  it('should create a blog', async () => {
    const createBlogDto: CreateBlogDto = {
      created_at: '2021-03-11T21:38:36Z',
      objectID: '1',
      title: 'Example Blog Title',
      author: 'John Doe',
      story_url: 'some story',
    };

    const createdBlog: Blog = {
      created_at: '2021-03-11T21:38:36Z',
      objectID: '1',
      title: 'Example Blog Title',
      story_url: 'some story',
      author: 'John Doe',
      valid: true,
    };

    jest.spyOn(service, 'createBlog').mockResolvedValue(createdBlog);
    const result = await controller.createBlog(createBlogDto);
    expect(result).toEqual(createdBlog);
  });

  it('should update a blog', async () => {
    const id = 'example_id';
    const updateBlogDto: UpdateBlogDto = {
      title: 'Example test',
      author: 'John Doe test',
    };

    const updatedBlog: Blog = {
      created_at: '2021-03-11T21:38:36Z',
      objectID: '1',
      title: 'Example Blog Title',
      story_url: 'some story',
      author: 'John Doe',
      valid: true,
    };
    jest.spyOn(service, 'updateBlog').mockResolvedValue(updatedBlog);
    const result = await controller.updateBlog(id, updateBlogDto);
    expect(result).toEqual(updatedBlog);
  });
});
