import { Configuration } from './criteria';
import { Keywords } from './model';
import { scrape } from './scraping';

export const handler = async (event: Configuration): Promise<Keywords> => {
  return await scrape(event);
}
