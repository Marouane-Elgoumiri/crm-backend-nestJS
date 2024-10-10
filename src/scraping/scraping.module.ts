import { Module } from '@nestjs/common';
import { ScrapingGateway } from './ScrapingGateway';

@Module({
    providers: [ScrapingGateway],
    exports: [ScrapingGateway],
})
export class ScrapingModule {}
