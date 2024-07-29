import { Module } from '@nestjs/common';
import { NftController } from 'src/controllers/nft/nft.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { NftService } from 'src/services/nft/nft.service';

@Module({
  controllers: [NftController],
  providers: [NftService, PrismaService],
})
export class NftModule {}
