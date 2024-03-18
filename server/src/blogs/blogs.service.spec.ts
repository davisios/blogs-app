import { Test, TestingModule } from '@nestjs/testing';
import { BlogsService } from './blogs.service';
import { getModelToken } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { Blog } from './schemas/Blog.schema';
import { HttpException } from '@nestjs/common';
import { CreateBlogDto } from './dto/CreateBlog.dto';
import { Model } from 'mongoose';
import { UpdateBlogDto } from './dto/updateBlogDto';
import { AlgoliaBlog } from 'src/blogs/models/AlgoliaSearchResponse';

describe('BlogsService', () => {
  let service: BlogsService;
  let httpService: HttpService;
  let models: Model<Blog>;

  const mockHttpService = {
    get: jest.fn(() => of({ data: { hits: [] } })),
  };

  class EventModel {
    constructor(private data) {}
    save = jest.fn();
    static create = jest.fn();
    static find = jest.fn();
    static findById = jest.fn();
    static findByIdAndUpdate = jest.fn();
    static findOneAndUpdate = jest.fn();
    static findByIdAndDelete = jest.fn();
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogsService,
        {
          provide: getModelToken(Blog.name),
          useValue: EventModel,
        },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<BlogsService>(BlogsService);
    httpService = module.get<HttpService>(HttpService);
    models = module.get<Model<Blog>>(getModelToken(Blog.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new blog', async () => {
    const mockCreateBlogDto: CreateBlogDto = {
      created_at: '2021-03-11T21:38:36Z',
      objectID: '1',
      title: 'Example Blog Title',
      author: 'John Doe',
      story_url: 'some story',
    };

    const mockSavedBlog = {
      ...mockCreateBlogDto,
      valid: true,
    };

    const spy = jest
      .spyOn(models, 'create')
      .mockResolvedValue(mockSavedBlog as any);

    const result = await service.createBlog(mockCreateBlogDto);

    expect(result).toEqual(expect.objectContaining(mockSavedBlog));
    expect(spy).toHaveBeenCalledWith(mockSavedBlog);
  });

  describe('deleteBlog', () => {
    it('should delete a blog', async () => {
      const id = '60c1f9fca6462b001fd415f1';
      const updatedBlog = { valid: false };
      const spy = jest
        .spyOn(models, 'findByIdAndUpdate')
        .mockResolvedValue(updatedBlog);

      await expect(service.deleteBlog(id));
      expect(spy).toHaveBeenCalledWith(id, {
        valid: false,
      });
    });

    it('should throw an error for invalid blog ID', async () => {
      const id = 'invalid_id';
      await expect(service.deleteBlog(id)).rejects.toThrow(HttpException);
    });
  });

  it('should update a blog', async () => {
    const id = '60c1f9fca6462b001fd415f1';
    const updateDto: UpdateBlogDto = {
      title: 'Updated Title',
      author: 'Updated Author',
    };
    const updatedBlog = { _id: id, ...updateDto };
    jest.spyOn(models, 'findByIdAndUpdate').mockResolvedValue(updatedBlog);
    const result = await service.updateBlog(id, updateDto);
    expect(result).toEqual(updatedBlog);
    expect(models.findByIdAndUpdate).toHaveBeenCalledWith(id, updateDto, {
      new: true,
    });
  });

  it('should return a blog by ID', async () => {
    const id = '60c1f9fca6462b001fd415f1';
    const mockBlog = {
      _id: id,
      title: 'Example Blog',
      author: 'John Doe',
    };
    jest.spyOn(models, 'findById').mockResolvedValue(mockBlog);
    const result = await service.getBlogById(id);
    expect(result).toEqual(mockBlog);
    expect(models.findById).toHaveBeenCalledWith(id);
  });

  describe('getRemoteBlogs', () => {
    it('should return remote blogs', async () => {
      const mockRemoteBlogs: AlgoliaBlog[] = [
        {
          created_at: '2022-01-01T00:00:00Z',
          objectID: '1',
          title: 'Remote Blog 1',
          author: 'John Doe',
          story_url: 'some story',
          _highlightResult: {
            story_title: {
              value: 'Example story_text result',
            },
          },
        },
      ];

      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(of({ data: { hits: mockRemoteBlogs } } as any));

      const result = await service.getRemoteBlogs();

      expect(result).toEqual(mockRemoteBlogs);
      expect(httpService.get).toHaveBeenCalled();
    });
  });

  describe('getBlogs', () => {
    it('should return local blogs if no remote blogs are available', async () => {
      const localBlogs = [
        {
          created_at: '2021-03-11T21:38:36Z',
          objectID: '1',
          title: 'Example Blog Title',
          author: 'John Doe',
          points: 10,
          num_comments: 5,
          story_text: 'Example story_text result',
        },
      ];
      jest.spyOn(models, 'find').mockImplementationOnce(
        () =>
          ({
            sort: () => localBlogs as any,
          }) as any,
      );
      jest.spyOn(service, 'getRemoteBlogs').mockResolvedValue([]);

      const result = await service.getBlogs();
      expect(result).toEqual(localBlogs);
      expect(models.find).toHaveBeenCalled();
    });
  });
});
