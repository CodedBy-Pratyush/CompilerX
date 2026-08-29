
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return res.status(400).json({
        success: false,
        msg: firstIssue ? firstIssue.message : "Invalid request",
      });
    }

    req.body = result.data;
    next();
  };
}

module.exports = validate;
