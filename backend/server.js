import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

// 初始化 Turndown 服务
const turndownService = new TurndownService({
  headingStyle: 'atx', // 使用 # 风格的标题
  codeBlockStyle: 'fenced', // 使用 ``` 风格的代码块
});

// 添加一个规则来处理微信的懒加载图片
// 微信通常把真实的图片 URL 放在 'data-src' 属性中
turndownService.addRule('wechat-image', {
  filter: 'img',
  replacement: function (content, node) {
    const alt = node.alt || '';
    // 优先从 data-src 获取，其次是 src
    let src = node.getAttribute('data-src') || node.getAttribute('src');

    if (!src) {
      // 如果两个都没有，返回空
      return '';
    }

    // 确保 URL 是 http 或 https 开头的
    if (src.startsWith('//')) {
      src = 'https:' + src;
    }
    
    // 如果 src 存在，则返回 Markdown 图片语法
    // 注意：这些图片链接可能因为防盗链而无法在 Markdown 查看器中显示
    if (src) {
      return `![${alt}](${src})\n\n`;
    }
    
    return '';
  }
});

// 中间件
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // 允许所有来源，生产环境建议设置具体域名
  credentials: true
})); // 允许跨域请求
app.use(express.json()); // 解析 JSON 请求体

// 单个文章转换函数
async function convertArticle(url) {
  if (!url || !url.includes('mp.weixin.qq.com')) {
    throw new Error('无效的微信文章 URL');
  }

  console.log(`正在抓取: ${url}`);

  try {
    // 1. 发送 HTTP GET 请求获取文章 HTML
    // 伪装 User-Agent 尝试绕过反爬
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = response.data;

    // 2. 使用 Cheerio 解析 HTML
    const $ = cheerio.load(html);

    // 3. 提取文章标题
    const title = $('#activity-name').text().trim() || '未命名文章';

    // 4. 提取文章主体内容
    // 微信文章内容通常在 id 为 'js_content' 的 div 中
    const contentHtml = $('#js_content').html();
    
    if (!contentHtml) {
      throw new Error('无法解析文章内容，可能被反爬策略阻挡');
    }

    // 5. 将 HTML 转换为 Markdown
    let markdown = turndownService.turndown(contentHtml);

    // 6. 在 Markdown 顶部添加标题
    const finalMarkdown = `# ${title}\n\n${markdown}`;

    console.log(`转换成功: ${title}`);
    return { markdown: finalMarkdown, title: title, url: url };

  } catch (error) {
    console.error(`抓取失败 (${url}):`, error.message);
    throw error;
  }
}

// API 路由 - 单个转换（保持向后兼容）
app.post('/api/convert', async (req, res) => {
  const { url } = req.body;

  try {
    const result = await convertArticle(url);
    res.json(result);
  } catch (error) {
    console.error('抓取或转换过程中出错:', error.message);
    if (error.response) {
      console.error('Axios 错误状态:', error.response.status);
    }
    res.status(500).json({ error: error.message || '抓取失败，请稍后再试或检查 URL' });
  }
});

// 并发控制函数：限制同时进行的请求数量
async function limitConcurrency(tasks, maxConcurrent) {
  const results = [];
  const executing = [];
  
  for (const task of tasks) {
    // 创建任务 promise
    const promise = (async () => {
      try {
        return await task();
      } finally {
        // 任务完成后从 executing 中移除
        const index = executing.indexOf(promise);
        if (index !== -1) {
          executing.splice(index, 1);
        }
      }
    })();
    
    executing.push(promise);
    results.push(promise);
    
    // 如果达到最大并发数，等待其中一个完成
    if (executing.length >= maxConcurrent) {
      await Promise.race(executing);
    }
  }
  
  // 等待所有任务完成
  return Promise.all(results);
}

// API 路由 - 批量转换
app.post('/api/convert-batch', async (req, res) => {
  try {
    const { urls } = req.body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: '请提供有效的 URL 数组' });
    }

    console.log(`收到批量转换请求，共 ${urls.length} 个链接`);

    const results = [];
    const errors = [];

    // 真正的并发控制：限制同时进行的请求数量
    const MAX_CONCURRENT = 5; // 最大并发数
    
    // 创建任务列表
    const tasks = urls.map((url, index) => async () => {
      try {
        console.log(`[${index + 1}/${urls.length}] 开始处理: ${url}`);
        const result = await convertArticle(url);
        return { success: true, ...result, index: index };
      } catch (error) {
        console.error(`[${index + 1}/${urls.length}] 处理失败: ${url}`, error.message);
        return { 
          success: false, 
          url: url, 
          error: error.message || '抓取失败',
          index: index 
        };
      }
    });

    // 使用并发控制执行所有任务
    const allResults = await limitConcurrency(tasks, MAX_CONCURRENT);
    
    // 分类结果
    allResults.forEach((result) => {
      if (result.success) {
        results.push(result);
      } else {
        errors.push(result);
      }
    });

    // 按原始索引排序，保持顺序
    results.sort((a, b) => a.index - b.index);
    errors.sort((a, b) => a.index - b.index);

    console.log(`批量转换完成: 成功 ${results.length} 个, 失败 ${errors.length} 个`);

    res.json({
      success: results,
      errors: errors,
      total: urls.length,
      successCount: results.length,
      errorCount: errors.length
    });
  } catch (error) {
    console.error('批量转换 API 错误:', error);
    res.status(500).json({ error: '批量转换失败: ' + error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`后端服务器运行在端口 ${port}`);
});

