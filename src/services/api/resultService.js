import resultsData from "@/services/mockData/results.json";

class ResultService {
  constructor() {
    this.results = [...resultsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.results];
  }

  async getById(id) {
    await this.delay();
    const result = this.results.find(r => r.Id === id);
    if (!result) {
      throw new Error("Result not found");
    }
    return { ...result };
  }

  async getByUserId(userId) {
    await this.delay();
    return this.results.filter(r => r.userId === userId).map(r => ({ ...r }));
  }

  async getByQuizId(quizId) {
    await this.delay();
    return this.results.filter(r => r.quizId === quizId).map(r => ({ ...r }));
  }

  async create(resultData) {
    await this.delay();
    const newId = Math.max(...this.results.map(r => r.Id)) + 1;
    const newResult = {
      Id: newId,
      ...resultData,
      completedAt: new Date().toISOString()
    };
    this.results.push(newResult);
    return { ...newResult };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.results.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Result not found");
    }
    this.results[index] = { ...this.results[index], ...updates };
    return { ...this.results[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.results.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Result not found");
    }
    this.results.splice(index, 1);
    return true;
  }
}

export const resultService = new ResultService();