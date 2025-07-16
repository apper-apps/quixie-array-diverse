import commentsData from "@/services/mockData/comments.json";

class CommentService {
  constructor() {
    this.comments = [...commentsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.comments];
  }

  async getById(id) {
    await this.delay();
    const comment = this.comments.find(c => c.Id === id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    return { ...comment };
  }

  async getByQuizId(quizId) {
    await this.delay();
    return this.comments
      .filter(c => c.quizId === quizId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(c => ({ ...c }));
  }

  async create(commentData) {
    await this.delay();
    const newId = Math.max(...this.comments.map(c => c.Id)) + 1;
    const newComment = {
      Id: newId,
      ...commentData,
      upvotes: 0,
      createdAt: new Date().toISOString(),
      parentId: null,
      user: {
        Id: commentData.userId,
        username: "QuizMaster2024", // Mock user data
        avatar: ""
      }
    };
    this.comments.push(newComment);
    return { ...newComment };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.comments.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Comment not found");
    }
    this.comments[index] = { ...this.comments[index], ...updates };
    return { ...this.comments[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.comments.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Comment not found");
    }
    this.comments.splice(index, 1);
    return true;
  }

  async upvote(id) {
    await this.delay();
    const index = this.comments.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Comment not found");
    }
    this.comments[index].upvotes += 1;
    return { ...this.comments[index] };
  }
}

export const commentService = new CommentService();