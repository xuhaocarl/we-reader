import axios from 'axios';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

// Initialize Turndown Service
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Rule for WeChat lazy-loaded images
turndownService.addRule('wechat-image', {
  filter: 'img',
  replacement: function (content, node) {
    const alt = node.alt || '';
    let src = node.getAttribute('data-src') || node.getAttribute('src');

    if (!src) return '';

    if (src.startsWith('//')) {
      src = 'https:' + src;
    }

    return `![${alt}](${src})\n\n`;
  }
});

async function convertWeChatArticle(html, url) {
  const $ = cheerio.load(html);
  const title = $('#activity-name').text().trim() || 'Untitled Article';
  const contentHtml = $('#js_content').html();

  if (!contentHtml) {
    throw new Error('Could not parse WeChat article content. It might be blocked.');
  }

  const markdown = turndownService.turndown(contentHtml);
  return { markdown: `# ${title}\n\n${markdown}`, title, url };
}

async function convertGenericArticle(html, url) {
  const doc = new JSDOM(html, { url });
  const reader = new Readability(doc.window.document);
  const article = reader.parse();

  if (!article) {
    throw new Error('Could not parse article content with Readability.');
  }

  const markdown = turndownService.turndown(article.content);
  return { markdown: `# ${article.title}\n\n${markdown}`, title: article.title, url };
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log(`Fetching: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = response.data;

    let result;
    if (url.includes('mp.weixin.qq.com')) {
      result = await convertWeChatArticle(html, url);
    } else {
      result = await convertGenericArticle(html, url);
    }

    res.status(200).json(result);

  } catch (error) {
    console.error('Error converting URL:', error);
    res.status(500).json({ error: error.message || 'Failed to convert URL' });
  }
}
