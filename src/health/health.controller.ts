import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async checkHealth() {
    return await this.healthService.checkHealth();
  }

  @Get('db')
  async checkDatabase() {
    return await this.healthService.checkDatabase();
  }

  @Get('redis')
  async checkRedis() {
    return await this.healthService.checkRedis();
  }

  @Get('firebase')
  async checkFirebase() {
    return await this.healthService.checkFirebase();
  }
}