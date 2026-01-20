# 🎯 Tech Mastery Lab - Backend API

Backend API server for Tech Mastery Lab that handles all external API calls with CORS support.

## 🚀 Features

- **Hacker News API** - Real-time top stories
- **GitHub Trending** - Latest trending repositories
- **Reddit Tech Posts** - Posts from tech subreddits
- **arXiv Research** - Latest CS research papers
- **Communities Data** - Tech community information
- **Quiz Questions** - Programming quiz database
- **Chat Endpoint** - Simple chat responses

## 📡 API Endpoints

### Base URL
```
Production: https://tech-mastery-backend.vercel.app
Local: http://localhost:3000
```

### Endpoints

#### GET /
Health check and API information

#### GET /api/news
Fetch Hacker News top stories (cached 5 min)

#### GET /api/github
Fetch GitHub trending repos (cached 15 min)

#### GET /api/reddit
Fetch Reddit tech posts (cached 10 min)

#### GET /api/research
Fetch arXiv research papers (cached 30 min)

#### GET /api/communities
Get tech communities list

#### GET /api/quiz
Get quiz questions

#### POST /api/chat
Send chat message and get AI response

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/Aurenya19/tech-mastery-backend.git
cd tech-mastery-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Server will run on `http://localhost:3000`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow prompts and your API will be live!

### Deploy to Railway

1. Connect GitHub repo to Railway
2. Railway will auto-detect Node.js
3. Set environment variables
4. Deploy!

## 📦 Dependencies

- **express** - Web framework
- **cors** - CORS middleware
- **axios** - HTTP client
- **node-cache** - In-memory caching
- **dotenv** - Environment variables

## 🔒 CORS Configuration

CORS is enabled for all origins. In production, you may want to restrict to specific domains:

```javascript
app.use(cors({
  origin: 'https://aurenya19.github.io'
}));
```

## 📝 Environment Variables

```env
PORT=3000
NODE_ENV=production
```

## 🧪 Testing

Test endpoints using curl:

```bash
# Health check
curl http://localhost:3000/

# Get news
curl http://localhost:3000/api/news

# Get GitHub trending
curl http://localhost:3000/api/github

# Get Reddit posts
curl http://localhost:3000/api/reddit

# Get research papers
curl http://localhost:3000/api/research
```

## 📊 Caching

- News: 5 minutes
- GitHub: 15 minutes
- Reddit: 10 minutes
- Research: 30 minutes

## 🤝 Contributing

Pull requests welcome! Please ensure:
- Code follows existing style
- All endpoints tested
- README updated if needed

## 📄 License

MIT License - feel free to use for your projects!

## 🔗 Links

- Frontend: https://aurenya19.github.io/tech-mastery-lab/
- Backend Repo: https://github.com/Aurenya19/tech-mastery-backend
- Frontend Repo: https://github.com/Aurenya19/tech-mastery-lab

---

Made with ❤️ for the Indian Tech Community 🇮🇳
