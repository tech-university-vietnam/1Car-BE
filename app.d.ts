declare namespace Express {
  // Override express Request type to have token and email
  export interface Request {
    auth: {
      token: string;
      email: string;
      userId: string;
    };
  }
}
