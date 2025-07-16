import quizzesData from "@/services/mockData/quizzes.json";

class QuizService {
  constructor() {
    this.quizzes = [...quizzesData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.quizzes];
  }

  async getById(id) {
    await this.delay();
    const quiz = this.quizzes.find(q => q.Id === id);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    return { ...quiz };
  }

  async getByUserId(userId) {
    await this.delay();
    return this.quizzes.filter(q => q.creatorId === userId).map(q => ({ ...q }));
  }

  async getByCategory(category) {
    await this.delay();
    return this.quizzes.filter(q => q.category === category).map(q => ({ ...q }));
  }

  async create(quizData) {
    await this.delay();
    const newId = Math.max(...this.quizzes.map(q => q.Id)) + 1;
    const newQuiz = {
      Id: newId,
      ...quizData,
      createdAt: new Date().toISOString()
    };
    this.quizzes.push(newQuiz);
    return { ...newQuiz };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.quizzes.findIndex(q => q.Id === id);
    if (index === -1) {
      throw new Error("Quiz not found");
    }
    this.quizzes[index] = { ...this.quizzes[index], ...updates };
    return { ...this.quizzes[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.quizzes.findIndex(q => q.Id === id);
    if (index === -1) {
      throw new Error("Quiz not found");
    }
    this.quizzes.splice(index, 1);
    return true;
  }

  async search(query) {
    await this.delay();
    const searchTerm = query.toLowerCase();
    return this.quizzes.filter(q => 
      q.title.toLowerCase().includes(searchTerm) ||
      q.description.toLowerCase().includes(searchTerm) ||
      q.category.toLowerCase().includes(searchTerm)
    ).map(q => ({ ...q }));
  }
}

export const quizService = new QuizService();