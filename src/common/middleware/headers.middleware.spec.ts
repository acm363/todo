import { HeadersMiddleware } from './headers.middleware';
import { NextFunction, Request, Response } from 'express';
import { createMock, DeepMocked } from '@golevelup/nestjs-testing';

describe('Headers Middleware', () => {
  let headersMiddleware: HeadersMiddleware;
  let req: DeepMocked<Request>;
  let res: DeepMocked<Response>;
  let next: NextFunction;
  const systemTime: Date = new Date('2022-04-20');

  it('should add the Returned-At header on the response.', async () => {
    // Given.
    req = createMock<Request>();
    res = createMock<Response>();
    next = jest.fn();
    headersMiddleware = new HeadersMiddleware();
    jest.useFakeTimers().setSystemTime(systemTime);

    // When.
    headersMiddleware.use(req, res, next);

    // Then.
    expect(res.setHeader).toBeCalledWith('Returned-At', systemTime.toLocaleString());
    expect(next).toBeCalled();
  });
});
