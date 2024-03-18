import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  created_at: string;
  @IsNotEmpty()
  @IsString()
  objectID: string;
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  author: string;
  @IsNotEmpty()
  @IsString()
  story_url: string;
}
