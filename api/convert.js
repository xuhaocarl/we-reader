// Vercel Serverless Function for /api/convert
import axios from 'axios';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

// 初始化 Turndown 服务
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// 添加微信图片处理规则
turndownService.addRule('wechat-image', {
  filter: 'img',
  replacement: function (content, node) {
    const alt = node.alt || '';
    let src = node.getAttribute('data-src') || node.getAttribute('src');

    if (!src) {
      return '';
    }

    if (src.startsWith('//')) {
      src = 'https:' + src;
    }
    
    if (src) {
      return `![${alt}](${src})\n\n`;
    }
    
    return '';
  }
});

// 单个文章转换函数
async function convertArticle(url) {
  if (!url || !url.includes('mp.weixin.qq.com')) {
    throw new Error('无效的微信文章 URL');
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = response.data;

    const $ = cheerio.load(html);
    const title = $('#activity-name').text().trim() || '未命名文章';
    const contentHtml = $('#js_content').html();
    
    if (!contentHtml) {
      throw new Error('无法解析文章内容，可能被反爬策略阻挡');
    }

    let markdown = turndownService.turndown(contentHtml);
    const finalMarkdown = `# ${title}\n\n${markdown}`;

    return { markdown: finalMarkdown, title: title, url: url };

  } catch (error) {
    throw error;
  }
}

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只处理 POST 请求
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { url } = req.body;

  try {
    const result = await convertArticle(url);
    res.status(200).json(result);
  } catch (error) {
    console.error('抓取或转换过程中出错:', error.message);
    if (error.response) {
      console.error('Axios 错误状态:', error.response.status);
    }
    res.status(500).json({ error: error.message || '抓取失败，请稍后再试或检查 URL' });
  }
}

