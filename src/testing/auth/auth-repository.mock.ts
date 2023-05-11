import { AuthService } from '../../auth/auth.service';

const mockAuthService = {};

export const authServiceMock = {
  provide: AuthService,
  useValue: mockAuthService,
};
