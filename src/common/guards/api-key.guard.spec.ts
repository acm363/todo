import { ApiKeyGuard } from './api-key.guard';
import { ConfigService } from '@nestjs/config';
import { createMock, DeepMocked } from '@golevelup/nestjs-testing';
import { ExecutionContext } from '@nestjs/common';

describe('ApiKeyGuard', () => {
  let apiKeyGuard: ApiKeyGuard;
  let configServiceMock: DeepMocked<ConfigService>;

  beforeEach(async () => {
    configServiceMock = createMock<ConfigService>();
    apiKeyGuard = new ApiKeyGuard(configServiceMock);
  });

  it('should return true when a valid authentication is given.', () => {
    // Given.
    const headers = {
      Authorization: 'bearer_key',
    };
    const authorization = 'bearer_key';
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: headers,
          header: (name): string => {
            return headers[name];
          },
        }),
      }),
    });
    configServiceMock.get.mockReturnValue(authorization);

    // When.
    const result = apiKeyGuard.canActivate(mockExecutionContext);

    // Then.
    expect(result).toBe(true);
  });

  it('should return false when an invalid authentication is given.', () => {
    // Given.
    const headers = {
      Authorization: 'auth',
    };
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: headers,
          header: (name): string => {
            return headers[name];
          },
        }),
      }),
    });
    configServiceMock.get.mockReturnValue('bearer_key');

    // When.
    const result = apiKeyGuard.canActivate(mockExecutionContext);

    // Then.
    expect(result).toBe(false);
  });
});
