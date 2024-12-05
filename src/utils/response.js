export function successResponse(res, data) {
    return res.status(200).json({
      status: true,
      message: 'Successful',
      data: data,
    });
}

export function errorResponse(res, statusCode, message) {
    return res.status(statusCode).json({
      status: false,
      message: message,
      data: null
    });
  }