// src/middleware/permissions.js
// Reuse your isAuth middleware that sets req.user. Here we add checks.

export const isAuthorOrAdmin = (getResourceAuthorId) => {
    return async (req, res, next) => {
      try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        // Allow admin/staff
        if (req.user.isAdmin || req.user.isStaff) return next();
  
        // getResourceAuthorId can be a function that returns id or a string path
        const authorId = await getResourceAuthorId(req);
        if (!authorId) return res.status(404).json({ message: "Resource not found" });
  
        if (authorId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: "Forbidden: not the author" });
        }
        return next();
      } catch (err) {
        next(err);
      }
    };
  };

  