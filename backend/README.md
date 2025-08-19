# EkoSolar Backend API

🌞 **Solar Energy Solutions Backend** - REST API for EkoSolar website providing solar calculations, contact forms, appointments, and review management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
# (Optional: configure SMTP for email functionality)

# Start development server
npm run dev
```

**Server will be running at:** `http://localhost:4500`

## 📋 API Endpoints

### Health Check
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system information

### Contact & Communication
- `POST /api/contact` - General contact form submission
- `POST /api/contact/quote` - Solar quote request
- `POST /api/contact/emergency` - Emergency solar repair request

### Solar Calculator
- `POST /api/calculator/solar-savings` - Calculate solar savings
- `POST /api/calculator/system-size` - Calculate recommended system size
- `POST /api/calculator/payback-period` - Calculate payback period
- `POST /api/calculator/roi` - Calculate return on investment
- `GET /api/calculator/incentives/:zipCode` - Get available incentives
- `GET /api/calculator/solar-data/:zipCode` - Get solar irradiance data

### Appointments
- `POST /api/appointments/schedule` - Schedule new appointment
- `POST /api/appointments/reschedule` - Reschedule existing appointment
- `POST /api/appointments/cancel` - Cancel appointment
- `GET /api/appointments/availability/:date` - Check date availability

### Reviews & Testimonials
- `POST /api/reviews/submit` - Submit customer review
- `GET /api/reviews/public` - Get published reviews
- `GET /api/reviews/stats` - Get review statistics
- `POST /api/reviews/request` - Request review from customer

## 🔧 Configuration

### Environment Variables

```env
# Server Configuration
PORT=4500
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email Configuration (Optional but recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=info@ekosolarpros.com

# Security
JWT_SECRET=your-secret-key
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### Email Setup (Optional)
To enable email notifications for contact forms and appointments:

1. **Gmail Setup:**
   - Enable 2-factor authentication
   - Generate an app-specific password
   - Use app password in `SMTP_PASS`

2. **Other SMTP Providers:**
   - Update `SMTP_HOST`, `SMTP_PORT`, and credentials
   - Ensure `SMTP_SECURE` is set correctly

## 🧮 Solar Calculator Features

### Accurate Georgia Solar Data
- Region-specific peak sun hours
- Local utility rates
- Georgia-specific incentives (35% state tax credit)
- Federal tax credit (30%)

### Calculation Types
- **Solar Savings**: Complete savings analysis
- **System Size**: Optimal solar system recommendation
- **Payback Period**: Investment recovery timeline
- **ROI Analysis**: Return on investment over 25 years

### Supported Regions
- Atlanta (30000-30999)
- Augusta (31000-31999) 
- Columbus (39000-39999)
- Savannah (31200-31299)
- All Georgia ZIP codes

## 📧 Contact Form Features

### Form Types
1. **General Contact** - Basic inquiries and questions
2. **Quote Request** - Solar system quote with property details
3. **Emergency Service** - Urgent solar system repairs

### Auto-Response System
- Immediate confirmation emails to customers
- Internal notifications to EkoSolar team
- Priority handling for emergency requests
- Professional branded email templates

### Validation & Security
- Input validation and sanitization
- Rate limiting (5 submissions per 15 minutes)
- CORS protection
- SQL injection prevention

## 📅 Appointment System

### Booking Features
- Service type selection (consultation, installation, repair, etc.)
- Date and time preferences
- Property information collection
- Emergency priority handling

### Management Functions
- Reschedule appointments
- Cancel appointments
- Check date availability
- Automated email confirmations

## ⭐ Review System

### Customer Reviews
- 5-star rating system
- Service type categorization
- Photo upload support (planned)
- Moderation workflow

### Public Display
- Filtered review retrieval
- Review statistics and analytics
- Average rating calculations
- Pagination support

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse of API endpoints
- **CORS Protection**: Restricts cross-origin requests
- **Input Validation**: All data validated and sanitized
- **Helmet.js**: Security headers for all responses
- **Environment Separation**: Development/production configs

## 🚀 Development

### Available Scripts
```bash
npm start      # Production server
npm run dev    # Development with nodemon
npm test       # Run tests (when implemented)
npm run lint   # ESLint code checking
```

### Project Structure
```
backend/
├── src/
│   ├── routes/           # API endpoint definitions
│   ├── services/         # Business logic and calculations
│   ├── middleware/       # Express middleware
│   └── server.js         # Main server file
├── config/              # Configuration files
├── package.json         # Dependencies and scripts
└── .env                # Environment variables
```

## 🔧 Customization

### Adding New Calculation Types
1. Add endpoint to `calculator.routes.js`
2. Implement logic in `calculator.service.js`
3. Update validation rules
4. Test with sample data

### Email Template Customization
- Edit `email.service.js`
- Modify HTML templates in `createEmailTemplate()`
- Update brand colors and messaging
- Test email rendering

### Adding New Contact Form Types
1. Add validation rules to `contact.routes.js`
2. Create email templates in `email.service.js`
3. Update auto-response logic
4. Test form submission flow

## 🧪 Testing

### API Testing
```bash
# Health check
curl http://localhost:4500/api/health

# Solar calculation
curl -X POST http://localhost:4500/api/calculator/solar-savings \
  -H "Content-Type: application/json" \
  -d '{"monthlyBill": 150, "zipCode": "30309"}'

# Contact form
curl -X POST http://localhost:4500/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "test@example.com", "message": "Test message"}'
```

## 📈 Monitoring

### Performance Monitoring
- Request/response logging
- Error tracking and reporting  
- Rate limit monitoring
- Email delivery status

### Analytics Integration
- API usage statistics
- Popular calculation types
- Contact form conversion rates
- Geographic usage patterns

## 🌱 Environmental Impact

The solar calculator includes environmental impact calculations:
- CO₂ reduction estimates
- Tree planting equivalents
- 25-year environmental benefits
- Clean energy production metrics

## 💡 Features Planned

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication system
- [ ] File upload for roof photos
- [ ] Integration with solar design tools
- [ ] Advanced appointment scheduling
- [ ] Customer portal
- [ ] Mobile app API support

## 📞 Support

For backend API support:
- Email: developers@ekosolarpros.com
- Documentation: Check inline code comments
- Issues: Report bugs and feature requests

---

**EkoSolar Backend** - Powering clean energy solutions with reliable API services ⚡🌞