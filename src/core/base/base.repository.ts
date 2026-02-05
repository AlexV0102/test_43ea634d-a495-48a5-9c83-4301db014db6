import { ObjectLiteral, Repository } from 'typeorm';

export abstract class BaseRepository<Entity extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<Entity>) {}

  async findOne(id: string): Promise<Entity | null> {
    return this.repository.findOne({ where: { id } as never });
  }

  async save(entity: Entity): Promise<Entity> {
    return this.repository.save(entity);
  }
}
