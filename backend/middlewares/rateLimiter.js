
import rateLimit from 'express-rate-limit';


export const rateLimitOTP = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 3, // allow max 3 OTP requests per email/IP in 3 minutes
    message: {
      success: false,
      error: 'Too many OTP requests, please try again after 3 minutes.'
    },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,  // Disable X-RateLimit headers
})