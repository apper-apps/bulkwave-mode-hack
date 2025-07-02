import mockSessions from '@/services/mockData/sendSessions.json';

class SendSessionService {
  constructor() {
    this.sessions = [...mockSessions];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.sessions];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const session = this.sessions.find(s => s.Id === parseInt(id));
    if (!session) {
      throw new Error(`Send session with ID ${id} not found`);
    }
    return { ...session };
  }

  async create(sessionData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...this.sessions.map(s => s.Id), 0);
    const newSession = {
      ...sessionData,
      Id: maxId + 1
    };
    this.sessions.push(newSession);
    return { ...newSession };
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.sessions.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Send session with ID ${id} not found`);
    }
    this.sessions[index] = { ...this.sessions[index], ...updates };
    return { ...this.sessions[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.sessions.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Send session with ID ${id} not found`);
    }
    this.sessions.splice(index, 1);
    return true;
  }
}

export const sendSessionService = new SendSessionService();