import { Injectable } from '@nestjs/common';
import { Nft, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NftService {
  constructor(private prisma: PrismaService) {}

  async nft(
    nftWhereUniqueInput: Prisma.NftWhereUniqueInput,
    params: {
      include?: Prisma.NftInclude;
    } = {},
  ): Promise<Nft | null> {
    const { include } = params;

    return this.prisma.nft.findUnique({
      where: nftWhereUniqueInput,
      include,
    });
  }

  async nfts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.NftWhereUniqueInput;
    where?: Prisma.NftWhereInput;
    orderBy?: Prisma.NftOrderByWithRelationInput;
  }): Promise<Nft[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.nft.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createNft(data: Prisma.NftCreateInput): Promise<Nft> {
    return this.prisma.nft.create({
      data,
    });
  }

  async updateNft(params: {
    where: Prisma.NftWhereUniqueInput;
    data: Prisma.NftUpdateInput;
  }): Promise<Nft> {
    const { where, data } = params;

    return this.prisma.nft.update({
      data,
      where,
    });
  }

  async deleteNft(where: Prisma.NftWhereUniqueInput): Promise<Nft> {
    return this.prisma.nft.delete({
      where,
    });
  }
}
