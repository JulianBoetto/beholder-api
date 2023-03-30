import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';

describe('Auth service Int', () => {
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
  });
  
  describe('FindUser', async () => {
    it('should find user', async () => {
      const user = await prisma.user.findFirst({ where: { id: 1 } })
      expect(user.email).toBe(process.env.EMAIL);
    })
  })
});