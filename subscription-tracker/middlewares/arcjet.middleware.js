import aj from "../config/arcjet.js";

export const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {requested: 1}); 
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) return res.status(429).json({ message: "Too many requests. Please try again later." });
            if (decision.reason.isBot()) return res.status(403).json({ message: "Bot detected." });
            return res.status(403).json({ message: "Access denied." });
        } 
            next(); // Allow the request to proceed
    }catch (error) {
        console.log(`Arcjet Middleware Error: ${error}  `);
        next(error);
    }   
    };