# Smart Email Subscription Aggregation System

An intelligent email subscription aggregation system that collects, analyzes, and displays various subscription email content in newspaper-style or browser homepage-style presentations.

## Features

- **Email Reception & Processing**: SMTP server for receiving and parsing emails
- **AI-Powered Analysis**: OpenRouter integration for intelligent content classification and reformatting
- **Modern UI**: React + TypeScript with glassmorphism effects using shadcn/ui
- **Multiple Layouts**: Newspaper-style and browser homepage-style views
- **Real-time Updates**: WebSocket support for live content updates
- **Dark/Light Mode**: Full theme support

## Tech Stack

### Backend
- FastAPI (Python 3.11+)
- PostgreSQL with SQLAlchemy
- Redis for caching
- OpenRouter API for AI analysis
- aiosmtpd for email reception

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS with shadcn/ui
- Framer Motion for animations
- React Query for data fetching
- Zustand for state management

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL
- Redis
- Docker & Docker Compose (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mailbox
```

2. Backend setup:
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
pip install -r requirements.txt
uvicorn app.main:app --reload
```

3. Frontend setup:
```bash
cd frontend
npm install
npm run dev
```

### Using Docker

```bash
docker-compose up -d
```

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/email_aggregator
OPENROUTER_API_KEY=your_openrouter_api_key
SECRET_KEY=your-secret-key-here
SMTP_HOST=0.0.0.0
SMTP_PORT=2525
ALLOWED_SENDERS=sender1@example.com,sender2@example.com
REDIS_URL=redis://localhost:6379/0
CORS_ORIGINS=http://localhost:3000
```

## API Endpoints

### Emails
- `POST /api/v1/emails/receive` - Receive new email
- `GET /api/v1/emails` - List emails
- `GET /api/v1/emails/{id}` - Get specific email
- `POST /api/v1/emails/{id}/analyze` - Trigger AI analysis

### Categories
- `GET /api/v1/categories` - List categories
- `POST /api/v1/categories` - Create category
- `PUT /api/v1/categories/{id}` - Update category
- `DELETE /api/v1/categories/{id}` - Delete category

### Summaries
- `GET /api/v1/summaries/daily` - Get daily summary
- `POST /api/v1/summaries/generate` - Generate summary

### Analytics
- `GET /api/v1/analytics/overview` - Get analytics overview
- `GET /api/v1/analytics/trends` - Get email trends

### Preferences
- `GET /api/v1/preferences` - Get user preferences
- `PUT /api/v1/preferences` - Update preferences

## Development

### Running Tests

Backend:
```bash
cd backend
pytest
```

Frontend:
```bash
cd frontend
npm test
```

### Code Style

Backend uses Black and Flake8:
```bash
cd backend
black app/
flake8 app/
```

Frontend uses ESLint:
```bash
cd frontend
npm run lint
```

## Project Structure

```
mailbox/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core configuration
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities
│   │   ├── pages/        # Page components
│   │   └── styles/       # CSS files
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
```

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request