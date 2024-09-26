import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Logger} from "@nestjs/common";
import { DataService } from "./data.service";
import { CreateDataDto, UpdateDataDto } from "./dto/data.dto/data.dto";

@Controller('data')
export class DataController {
  private readonly logger = new Logger(DataController.name);
  constructor(private readonly dataService: DataService) {

  }
  @Post()
  create(@Body() createDataDto: CreateDataDto) {
    return this.dataService.create(createDataDto);
  }

  @Get()
  findAll() {
    return this.dataService.findAll();
  }

  @Get('scraping-progress')
  getScrapingProgress() {
    return { progress: this.dataService.getScrapingProgress() };
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDataDto: UpdateDataDto) {
    return this.dataService.update(id, updateDataDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataService.remove(id);
  }
  @Delete()
  removeAll(){
    return this.dataService.removeAll();
  }

  @Post('trigger-scraping')
  async triggerScraping() {
    try {
      const result = await this.dataService.triggerScraping();

      if (result.success) {
        return {
          statusCode: HttpStatus.OK,
          message: result.message,
          summary: result.summary
        };
      } else {
        this.logger.warn(`Scraping failed: ${result.message}`);
        throw new HttpException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: result.message
        }, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      this.logger.error(`Error in triggerScraping controller: ${error.message}`);
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred while triggering the scraping process.',
        error: error.message
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}