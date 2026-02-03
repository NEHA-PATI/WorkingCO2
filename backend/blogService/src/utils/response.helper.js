export const successResponse = (data, message = 'Success', meta = {}) => {
  return {
    success: true,
    message,
    data,
    ...meta,
  };
};

export const errorResponse = (message = 'Error occurred', statusCode = 500, errors = null) => {
  return {
    success: false,
    message,
    statusCode,
    errors,
  };
};

export const paginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
