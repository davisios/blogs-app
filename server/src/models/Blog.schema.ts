import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Blog {
  @Prop({ unique: true, required: true })
  objectID: string;
  @Prop({ required: true })
  created_at: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  author: string;
  @Prop({ required: true })
  story_url: string;
}

export const BlogsSchema = SchemaFactory.createForClass(Blog);
