exports.validate = schema => async (req, res, next) => {
  try {
    // validate the request body
    await schema.validateAsync(req.body, {
      abortEarly: false, // return all errors
      errors: {
        wrap: {
          label: '',
        },
      },
    });

    next();
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
