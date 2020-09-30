import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';

@Injectable()
export class ClientsService {
    constructor(@InjectRepository(Client) private readonly repository: Repository<Client>) {}

    findById(id: string): Promise<Client> {
        return this.repository.findOne(id);
    }
}
