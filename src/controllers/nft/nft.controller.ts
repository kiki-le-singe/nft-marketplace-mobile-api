import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Prisma, Nft } from '@prisma/client';
import { NftService } from 'src/services/nft/nft.service';

@Controller('nfts')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get(':id')
  async getNftById(@Param('id') id: string): Promise<Nft> {
    const nftId = Number(id);

    if (Number.isNaN(nftId)) {
      throw new BadRequestException(`Invalid NFT ID: ${id}`);
    }

    const nft = await this.nftService.nft(
      { id: nftId },
      {
        include: {
          author: true,
          categories: true,
        },
      },
    );

    if (!nft) {
      throw new NotFoundException(`NFT with ID ${id} not found`);
    }

    return nft;
  }

  @Get()
  async getNfts(): Promise<Nft[]> {
    return this.nftService.nfts({});
  }

  @Post()
  async createNft(@Body() data: Prisma.NftCreateInput): Promise<Nft> {
    try {
      const newNft = await this.nftService.createNft(data);

      return newNft;
    } catch (error) {
      console.error('Error creating NFT:', error);

      throw new InternalServerErrorException('Failed to create NFT');
    }
  }

  @Put(':id')
  async updateNft(
    @Param('id') id: string,
    @Body() data: Prisma.NftUpdateInput,
  ): Promise<Nft> {
    const nftId = Number(id);

    if (Number.isNaN(nftId)) {
      throw new BadRequestException(`Invalid NFT ID: ${id}`);
    }

    try {
      const updatedNft = await this.nftService.updateNft({
        where: { id: nftId },
        data,
      });

      if (!updatedNft) {
        throw new NotFoundException(`NFT with ID ${id} not found`);
      }

      return updatedNft;
    } catch (error) {
      console.error('Error updating NFT:', error);

      throw new InternalServerErrorException('Failed to update NFT');
    }
  }

  @Delete(':id')
  async deleteNft(@Param('id') id: string): Promise<Nft> {
    const nftId = Number(id);

    if (Number.isNaN(nftId)) {
      throw new BadRequestException(`Invalid NFT ID: ${id}`);
    }

    try {
      const deletedNft = await this.nftService.deleteNft({ id: nftId });

      if (!deletedNft) {
        throw new NotFoundException(`NFT with ID ${id} not found`);
      }

      return deletedNft;
    } catch (error) {
      console.error('Error deleting NFT:', error);

      throw new InternalServerErrorException('Failed to delete NFT');
    }
  }
}
