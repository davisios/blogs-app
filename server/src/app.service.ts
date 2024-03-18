import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import {
  AlgoliaBlog,
  AlgoliaSearchResponse,
} from './models/AlgoliaSearchResponse';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly httpService: HttpService) {}

  async getBlogs(): Promise<AlgoliaSearchResponse> {
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
    const hits: AlgoliaBlog[] = data.hits;
    //TODO get all db blogs latest dbhit
    //if does not match the id of the last hit then insert it

    return data;
  }
}
