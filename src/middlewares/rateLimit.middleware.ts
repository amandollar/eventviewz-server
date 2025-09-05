import rateLimit from 'express-rate-limit';

// General API rate limiter remove for now - we need to implement it 



// Stricter rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per windowMs (more strict for auth)
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
      retryAfter: '15 minutes',
      limit: req.rateLimit?.limit,
      remaining: req.rateLimit?.remaining,
      resetTime: req.rateLimit?.resetTime
    });
  }
});

// Rate limiter for file uploads (more strict)
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many file uploads from this IP, please try again after 1 hour.',
      retryAfter: '1 hour',
      limit: req.rateLimit?.limit,
      remaining: req.rateLimit?.remaining,
      resetTime: req.rateLimit?.resetTime
    });
  }
});

// Rate limiter for event creation (moderate)
export const eventCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 event creations per hour
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many event creations from this IP, please try again after 1 hour.',
      retryAfter: '1 hour',
      limit: req.rateLimit?.limit,
      remaining: req.rateLimit?.remaining,
      resetTime: req.rateLimit?.resetTime
    });
  }
});

// Rate limiter for registration endpoints (moderate)
export const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 registrations per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many registration attempts from this IP, please try again after 15 minutes.',
      retryAfter: '15 minutes',
      limit: req.rateLimit?.limit,
      remaining: req.rateLimit?.remaining,
      resetTime: req.rateLimit?.resetTime
    });
  }
});

// Rate limiter for payment endpoints (very strict for security)
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 payment operations per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many payment operations from this IP, please try again after 15 minutes.',
      retryAfter: '15 minutes',
      limit: req.rateLimit?.limit,
      remaining: req.rateLimit?.remaining,
      resetTime: req.rateLimit?.resetTime
    });
  }
});
