// 🚀 TECH MASTERY LAB - BACKEND API SERVER
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Cache setup (5 minutes for news, 15 for GitHub, 10 for Reddit)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: '🎯 Tech Mastery Lab Backend API',
    version: '1.0.0',
    endpoints: {
      news: '/api/news',
      github: '/api/github',
      reddit: '/api/reddit',
      research: '/api/research',
      communities: '/api/communities'
    }
  });
});

// ==================== HACKER NEWS API ====================
app.get('/api/news', async (req, res) => {
  try {
    console.log('📰 Fetching Hacker News...');
    
    // Check cache
    const cached = cache.get('news');
    if (cached) {
      console.log('✅ Returning cached news');
      return res.json(cached);
    }
    
    // Fetch top stories
    const topStoriesRes = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    const storyIds = topStoriesRes.data.slice(0, 100);
    
    // Fetch story details in batches
    const stories = await Promise.all(
      storyIds.map(async (id) => {
        try {
          const storyRes = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return storyRes.data;
        } catch (err) {
          return null;
        }
      })
    );
    
    const validStories = stories.filter(s => s && s.title);
    
    // Cache the result
    cache.set('news', validStories);
    
    console.log(`✅ Fetched ${validStories.length} stories`);
    res.json(validStories);
    
  } catch (error) {
    console.error('❌ News API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch news', message: error.message });
  }
});

// ==================== GITHUB TRENDING API ====================
app.get('/api/github', async (req, res) => {
  try {
    console.log('💻 Fetching GitHub trending...');
    
    // Check cache
    const cached = cache.get('github');
    if (cached) {
      console.log('✅ Returning cached GitHub data');
      return res.json(cached);
    }
    
    // Fetch trending repos (using GitHub search API)
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dateStr = lastWeek.toISOString().split('T')[0];
    
    const response = await axios.get('https://api.github.com/search/repositories', {
      params: {
        q: `created:>${dateStr}`,
        sort: 'stars',
        order: 'desc',
        per_page: 100
      },
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Tech-Mastery-Lab'
      }
    });
    
    const repos = response.data.items;
    
    // Cache the result (15 minutes)
    cache.set('github', repos, 900);
    
    console.log(`✅ Fetched ${repos.length} repos`);
    res.json(repos);
    
  } catch (error) {
    console.error('❌ GitHub API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch GitHub data', message: error.message });
  }
});

// ==================== REDDIT API ====================
app.get('/api/reddit', async (req, res) => {
  try {
    console.log('🕵️ Fetching Reddit posts...');
    
    // Check cache
    const cached = cache.get('reddit');
    if (cached) {
      console.log('✅ Returning cached Reddit data');
      return res.json(cached);
    }
    
    // Fetch from multiple tech subreddits
    const subreddits = ['programming', 'technology', 'webdev', 'javascript', 'python', 'machinelearning'];
    
    const allPosts = await Promise.all(
      subreddits.map(async (sub) => {
        try {
          const response = await axios.get(`https://www.reddit.com/r/${sub}/hot.json?limit=20`, {
            headers: {
              'User-Agent': 'Tech-Mastery-Lab/1.0'
            }
          });
          return response.data.data.children.map(child => ({
            ...child.data,
            subreddit_name: sub
          }));
        } catch (err) {
          console.error(`Failed to fetch r/${sub}:`, err.message);
          return [];
        }
      })
    );
    
    const posts = allPosts.flat().slice(0, 100);
    
    // Cache the result (10 minutes)
    cache.set('reddit', posts, 600);
    
    console.log(`✅ Fetched ${posts.length} posts`);
    res.json(posts);
    
  } catch (error) {
    console.error('❌ Reddit API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch Reddit data', message: error.message });
  }
});

// ==================== ARXIV RESEARCH PAPERS API ====================
app.get('/api/research', async (req, res) => {
  try {
    console.log('🔬 Fetching arXiv papers...');
    
    // Check cache
    const cached = cache.get('research');
    if (cached) {
      console.log('✅ Returning cached research data');
      return res.json(cached);
    }
    
    // Fetch latest CS papers from arXiv
    const categories = ['cs.AI', 'cs.LG', 'cs.CV', 'cs.CL', 'cs.CR'];
    
    const allPapers = await Promise.all(
      categories.map(async (cat) => {
        try {
          const response = await axios.get('http://export.arxiv.org/api/query', {
            params: {
              search_query: `cat:${cat}`,
              start: 0,
              max_results: 20,
              sortBy: 'submittedDate',
              sortOrder: 'descending'
            }
          });
          
          // Parse XML response (simplified)
          const entries = response.data.match(/<entry>(.*?)<\/entry>/gs) || [];
          return entries.map(entry => {
            const title = entry.match(/<title>(.*?)<\/title>/s)?.[1]?.trim();
            const summary = entry.match(/<summary>(.*?)<\/summary>/s)?.[1]?.trim();
            const authors = entry.match(/<name>(.*?)<\/name>/g)?.map(a => a.replace(/<\/?name>/g, '').trim()) || [];
            const link = entry.match(/<id>(.*?)<\/id>/)?.[1]?.trim();
            const published = entry.match(/<published>(.*?)<\/published>/)?.[1]?.trim();
            
            return { title, summary, authors, link, published, category: cat };
          });
        } catch (err) {
          console.error(`Failed to fetch ${cat}:`, err.message);
          return [];
        }
      })
    );
    
    const papers = allPapers.flat().filter(p => p.title).slice(0, 100);
    
    // Cache the result (30 minutes)
    cache.set('research', papers, 1800);
    
    console.log(`✅ Fetched ${papers.length} papers`);
    res.json(papers);
    
  } catch (error) {
    console.error('❌ Research API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch research data', message: error.message });
  }
});

// ==================== COMMUNITIES DATA ====================
app.get('/api/communities', (req, res) => {
  const communities = [
    {
      name: "Hacker News",
      category: "News",
      members: "5M+",
      url: "https://news.ycombinator.com",
      description: "Tech news and discussions"
    },
    {
      name: "Reddit r/programming",
      category: "Discussion",
      members: "6M+",
      url: "https://reddit.com/r/programming",
      description: "Programming discussions"
    },
    {
      name: "Dev.to",
      category: "Blogging",
      members: "1M+",
      url: "https://dev.to",
      description: "Developer community"
    },
    {
      name: "Stack Overflow",
      category: "Q&A",
      members: "20M+",
      url: "https://stackoverflow.com",
      description: "Programming Q&A"
    },
    {
      name: "GitHub",
      category: "Code",
      members: "100M+",
      url: "https://github.com",
      description: "Code hosting platform"
    },
    {
      name: "Product Hunt",
      category: "Products",
      members: "5M+",
      url: "https://producthunt.com",
      description: "New product launches"
    },
    {
      name: "Indie Hackers",
      category: "Startup",
      members: "500K+",
      url: "https://indiehackers.com",
      description: "Indie maker community"
    },
    {
      name: "Hashnode",
      category: "Blogging",
      members: "500K+",
      url: "https://hashnode.com",
      description: "Developer blogging"
    }
  ];
  
  res.json(communities);
});

// ==================== QUIZ QUESTIONS ====================
app.get('/api/quiz', (req, res) => {
  const questions = [
    {
      id: 1,
      category: "Web Dev",
      question: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
      correct: 0,
      difficulty: "easy"
    },
    {
      id: 2,
      category: "JavaScript",
      question: "Which company developed JavaScript?",
      options: ["Microsoft", "Netscape", "Google", "Mozilla"],
      correct: 1,
      difficulty: "medium"
    },
    {
      id: 3,
      category: "AI/ML",
      question: "What does GPU stand for?",
      options: ["General Processing Unit", "Graphics Processing Unit", "Global Processing Unit", "Graphical Performance Unit"],
      correct: 1,
      difficulty: "easy"
    }
    // Add more questions as needed
  ];
  
  res.json(questions);
});

// ==================== CHAT ENDPOINT (Simple) ====================
app.post('/api/chat', async (req, res) => {
  try {
    const { message, room } = req.body;
    
    // Simple AI response (you can integrate with OpenAI/Gemini later)
    const responses = [
      "That's an interesting question! Let me think about it...",
      "Great point! Here's what I know about that...",
      "I can help with that! Based on my knowledge...",
      "Excellent question! The answer is..."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    res.json({
      success: true,
      response: randomResponse,
      room: room || 'general',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Chat error:', error.message);
    res.status(500).json({ error: 'Chat failed', message: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Tech Mastery Backend running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}`);
});
