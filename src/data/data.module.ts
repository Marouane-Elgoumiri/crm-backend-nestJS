import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { Data, DataSchema } from './schemas/data.schema';
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScrapingModule } from 'src/scraping/scraping.module';
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: Data.name, schema: DataSchema }]),
    ScrapingModule,
  ],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}