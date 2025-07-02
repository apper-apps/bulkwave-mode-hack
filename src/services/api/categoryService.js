import mockCategories from '@/services/mockData/categories.json';

class CategoryService {
  constructor() {
    this.categories = [...mockCategories];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...this.categories];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const category = this.categories.find(c => c.Id === parseInt(id));
    if (!category) {
      throw new Error(`Category with ID ${id} not found`);
    }
    return { ...category };
  }

  async create(categoryData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...this.categories.map(c => c.Id), 0);
    const newCategory = {
      ...categoryData,
      Id: maxId + 1
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Category with ID ${id} not found`);
    }
    this.categories[index] = { ...this.categories[index], ...updates };
    return { ...this.categories[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Category with ID ${id} not found`);
    }
    this.categories.splice(index, 1);
    return true;
  }
}

export const categoryService = new CategoryService();