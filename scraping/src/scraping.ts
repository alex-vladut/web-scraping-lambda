import { load } from 'cheerio';
import { args, executablePath, headless } from 'chrome-aws-lambda';
import parseDomain from 'parse-domain';
import { launch, Page } from 'puppeteer-core';

import { Configuration, Target } from './criteria';
import { Keyword, Keywords } from './model';

let page: Page | null = null;

export const scrape = async (configuration: Configuration): Promise<Keywords> => {
  // cache browser instance to speedup the process
  page = page || await initPage();

  let result: Keywords = {};
  let previousWebsite = null;
  for (const target of configuration.targets) {
    if (previousWebsite !== target.website) {
      await page.goto(target.website, { waitUntil: 'networkidle2' });
    }
    const content = await page.content();
    const $ = load(content);
    result = {
      ...result,
      [target.category]: extractAttributes($, target),
    };

    previousWebsite = target.website;
  }

  return result;
}

const initPage = async () => {
  const browser = await launch({
    args,
    executablePath: await executablePath,
    headless,
  });
  page = await browser.newPage();
  return page;
}

const extractAttributes = ($: CheerioStatic, target: Target): Keyword[] => {
  const attributes: Keyword[] = [];
  const { selector, website } = target;
  $(selector).each((index: number, element: CheerioElement) => {
    const name = sanitize($(element).text());
    const url = addDomain($(element).attr('href'), website);
    if (name && url) {
      attributes.push({ name, url });
    }
  });
  return attributes;
}

const sanitize = (name: string) => {
  let result = name.trim().replace(/\([0-9]+\)$/g, '');
  if (result.match(/[^ ][0-9]+$/g)) {
    result = result.replace(/[0-9]+$/g, '');
  }
  return result;
}

const addDomain = (url: string, website: string) => {
  if (!url) {
    return url;
  }

  let result = null;
  if (parseDomain(url)) {
    result = url.startsWith('//') ? `https:${url}` : url;
  } else {
    const domain = buildDomain(parseDomain(website));
    result = url.startsWith('/') ? `${domain}${url}` : `${domain}/${url}`;
  }
  return result.replace('javascript:void(0)', '');
}

const buildDomain = (parsedDomain: any) => {
  return parsedDomain.subdomain
    ? `${parsedDomain.subdomain}.${parsedDomain.domain}.${parsedDomain.tld}`
    : `${parsedDomain.domain}.${parsedDomain.tld}`;
}
