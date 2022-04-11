// import { ApiKeyGuard } from './api-key.guard';
// import { ConfigService } from '@nestjs/config';
// import { Test, TestingModule } from '@nestjs/testing';
//
// const key_value = 'a special key';
// class ApiKeyGuardMock {
//   canActivate(authentication: string) {
//     return authentication === key_value;
//   }
// }
//
// describe('ApiKeyGuard', () => {
//   let configService: ConfigService;
//   let apiKeyGuard: ApiKeyGuard;
//   let apiKeyGuardMock: ApiKeyGuardMock;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [ConfigService],
//     }).compile();
//     configService = module.get<ConfigService>(ConfigService);
//     apiKeyGuard = new ApiKeyGuard(configService);
//     apiKeyGuardMock = new ApiKeyGuardMock();
//   });
//
//   it('should be defined', () => {
//     expect(apiKeyGuard).toBeDefined();
//   });
//
//   describe('Match Authentification Key', () => {
//     describe('when authentification key is correct', () => {
//       it('should return true', async () => {
//         expect(apiKeyGuardMock.canActivate(key_value)).toBeTruthy();
//       });
//     });
//     describe('otherwise', () => {
//       it('should return false', async () => {
//         expect(apiKeyGuardMock.canActivate('')).toBeFalsy();
//       });
//     });
//   });
// });
