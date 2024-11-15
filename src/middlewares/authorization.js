import jwt from 'jsonwebtoken';
import { promisify } from "util"
import { errorResponse } from '../utils/response.js';

export default class Authorization {
  static async verifyToken(req, res, next) {
    try {
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }
      if (!token) {
        return next(
          errorResponse(res, 400, 'you are not logged in!.. please log in')
        );
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      throw err;
    }
  }
  static async loggedInUserId(req, res) {
   try{
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    const userId = decoded.id;
    return userId;
   } catch (err){
    throw err;
   }
  }
}
