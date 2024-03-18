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
  points: number;
  @IsNotEmpty()
  @IsString()
  num_comments: number;
  @IsNotEmpty()
  @IsString()
  story_text: string;
}
