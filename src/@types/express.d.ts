// Create type definitions for added items to Express Request object

declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}
