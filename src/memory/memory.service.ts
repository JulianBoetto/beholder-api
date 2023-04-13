import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoryService {
    MEMORY: object = {};

    async getMemory(symbol: string, index: string, interval?: string) {
        if (symbol && index) {
          const indexKey = interval ? `${index}_${interval}` : index;
          const memoryKey = `${symbol}:${indexKey}`;
    
          const result = this.MEMORY[memoryKey];
          return typeof result === 'object' ? { ...result } : result;
        }
        return { ...this.MEMORY };
      }
}
