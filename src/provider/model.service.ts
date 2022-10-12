import knexConnection from "../loaders/db";

class ModelService {
  private Model: string;

  constructor(model: string) {
    this.Model = model;
  }

  async find() {
    return await knexConnection(this.Model).select("*");
  }

  async findOne(query: Record<string, any>) {
    return await knexConnection(this.Model).select("*").where(query);
  }

  async create(data: Record<string, any>) {
    return await knexConnection(this.Model).insert(data);
  }

  async customFind(field: string, identifier: string, options: string) {
    return await knexConnection(this.Model)
      .select(field)
      .orderBy(identifier, options)
      .limit(1);
  }

  async update(query: Record<string, any>, target: Record<string, any>) {
    return await knexConnection(this.Model).where(query).update(target);
  }

  async remove(target: Record<string, any>) {
    return await knexConnection(this.Model).where(target).delete();
  }
}

export default ModelService;
