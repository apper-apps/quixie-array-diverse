import usersData from "@/services/mockData/users.json";

class UserService {
  constructor() {
    this.users = [...usersData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.users];
  }

  async getById(id) {
    await this.delay();
    const user = this.users.find(u => u.Id === id);
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async getStats(userId) {
    await this.delay();
    const user = this.users.find(u => u.Id === userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    return {
      quizzesTaken: user.quizzesTaken,
      quizzesCreated: user.quizzesCreated,
      totalPoints: user.totalPoints,
      averageScore: user.averageScore,
      achievements: user.achievements.length
    };
  }

  async create(userData) {
    await this.delay();
    const newUser = {
      Id: `user-${Date.now()}`,
      ...userData,
      quizzesTaken: 0,
      quizzesCreated: 0,
      totalPoints: 0,
      averageScore: 0,
      achievements: [],
      joinedAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    this.users[index] = { ...this.users[index], ...updates };
    return { ...this.users[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    this.users.splice(index, 1);
    return true;
  }
}

export const userService = new UserService();