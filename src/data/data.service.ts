import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Data } from './schemas/data.schema';
import { CreateDataDto, UpdateDataDto } from './dto/data.dto/data.dto';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from "node:path";
import { PrismaService } from 'src/prisma/prisma.service';

const execPromise = promisify(exec);

@Injectable()
export class DataService {
  private scrapingProgress = 0;
  private readonly logger = new Logger(DataService.name);
  constructor(private readonly prismaService: PrismaService, @InjectModel(Data.name) private dataModel: Model<Data>) {

  }

  async create(createDataDto: CreateDataDto): Promise<Data> {
    const createdData = new this.dataModel(createDataDto);
    return createdData.save();
  }

  findAll(){
    this.logger.log('Executing findAll query');
    return this.prismaService.kerix_companies.findMany();
    
  }

  findOne(id: string){
    return this.prismaService.kerix_companies.findUnique({
      where: {id: id}
    })
  }
  removeAll(){
    return this.prismaService.kerix_companies.deleteMany({});
  }
  async update(id: string, updateDataDto: UpdateDataDto): Promise<Data> {
    return this.dataModel.findByIdAndUpdate(id, updateDataDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Data> {
    return this.dataModel.findByIdAndDelete(id).exec();
  }

  getScrapingProgress(): number {
    return this.scrapingProgress;
  }

  async triggerScraping(): Promise<{ success: boolean; message: string; summary?: any }> {
    this.scrapingProgress = 0;
    try {
      const scriptDir = path.resolve(__dirname, '..', '..', '..', 'scraper', 'Kerix_scraper');
      const venvDir = path.resolve(__dirname, '..', '..', '..', 'scraper')

      const scriptPath = path.join(scriptDir, 'main_script.py');
      const venvPath = path.join(venvDir, 'venv', 'bin', 'activate');
      const requirementsPath = path.join(scriptDir, 'requirements.txt');
      
      const command = `source ${venvPath} && python ${scriptPath}`;
      const installCommand = `source ${venvDir}/venv/bin/activate && pip install -r ${requirementsPath}`;
      
      this.logger.log(`Installing requirements: ${installCommand}`);
      
      await execPromise(installCommand, {
        cwd: scriptDir,
        shell: '/bin/bash',
      });

      this.logger.log(`Executing command: ${command}`);
      
      const { stdout, stderr } = await execPromise(command, {
        cwd: scriptDir,
        shell: '/bin/bash',
      });
      
      if (stderr) {
        this.logger.warn(`Scraping script warning: ${stderr}`);
      }
      
      this.logger.log(`Scraping output: ${stdout}`);
      const progressMatch = stdout.toString().match(/Progress: (\d+)%/);
      if (progressMatch) {
          this.scrapingProgress = parseInt(progressMatch[1]);
      }
      const insertedRecordsMatch = stdout.match(/Inserted (\d+) records/);
      const insertedRecords = insertedRecordsMatch ? parseInt(insertedRecordsMatch[1]) : 0;

      return { 
        success: true, 
        message: 'Scraping completed successfully',
        summary: {
          newItemsAdded: insertedRecords,
          scrapingOutput: stdout.trim()
        }
      };
    } catch (error) {
      this.logger.error(`Error executing scraping script: ${error.message}`);
      return { 
        success: false, 
        message: `Failed to execute scraping script: ${error.message}`
      };
    }
  }
}