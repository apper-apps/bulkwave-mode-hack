import mockRecipients from '@/services/mockData/recipients.json';

class RecipientService {
  constructor() {
    this.recipients = [...mockRecipients];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.recipients];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const recipient = this.recipients.find(r => r.Id === parseInt(id));
    if (!recipient) {
      throw new Error(`Recipient with ID ${id} not found`);
    }
    return { ...recipient };
  }

  async create(recipientData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...this.recipients.map(r => r.Id), 0);
    const newRecipient = {
      ...recipientData,
      Id: maxId + 1,
      selected: false
    };
    this.recipients.push(newRecipient);
    return { ...newRecipient };
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.recipients.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Recipient with ID ${id} not found`);
    }
    this.recipients[index] = { ...this.recipients[index], ...updates };
    return { ...this.recipients[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.recipients.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Recipient with ID ${id} not found`);
    }
    this.recipients.splice(index, 1);
    return true;
  }
}

export const recipientService = new RecipientService();