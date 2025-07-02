class CategoryService {
  constructor() {
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    if (!this.apperClient) this.initializeClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "color" } },
        { field: { Name: "recipient_ids" } }
      ]
    };

    const response = await this.apperClient.fetchRecords('category', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data?.map(category => ({
      ...category,
      recipient_ids: category.recipient_ids ? category.recipient_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
    })) || [];
  }

  async getById(id) {
    if (!this.apperClient) this.initializeClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "color" } },
        { field: { Name: "recipient_ids" } }
      ]
    };

    const response = await this.apperClient.getRecordById('category', parseInt(id), params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    const category = response.data;
    return {
      ...category,
      recipient_ids: category.recipient_ids ? category.recipient_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
    };
  }

  async create(categoryData) {
    if (!this.apperClient) this.initializeClient();
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: categoryData.name || categoryData.Name,
        Tags: categoryData.Tags || '',
        Owner: categoryData.Owner,
        color: categoryData.color,
        recipient_ids: Array.isArray(categoryData.recipientIds || categoryData.recipient_ids) ? 
          (categoryData.recipientIds || categoryData.recipient_ids).join(',') : 
          (categoryData.recipientIds || categoryData.recipient_ids || '')
      }]
    };

    const response = await this.apperClient.createRecord('category', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error('Failed to create category');
      }
      
      const created = successfulRecords[0]?.data;
      return {
        ...created,
        recipient_ids: created.recipient_ids ? created.recipient_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
      };
    }
  }

  async update(id, updates) {
    if (!this.apperClient) this.initializeClient();
    
    // Only include Updateable fields
    const updateData = {
      Id: parseInt(id)
    };
    
    if (updates.name !== undefined || updates.Name !== undefined) updateData.Name = updates.name || updates.Name;
    if (updates.Tags !== undefined) updateData.Tags = updates.Tags;
    if (updates.Owner !== undefined) updateData.Owner = updates.Owner;
    if (updates.color !== undefined) updateData.color = updates.color;
    if (updates.recipientIds !== undefined || updates.recipient_ids !== undefined) {
      const ids = updates.recipientIds || updates.recipient_ids;
      updateData.recipient_ids = Array.isArray(ids) ? ids.join(',') : ids;
    }

    const params = {
      records: [updateData]
    };

    const response = await this.apperClient.updateRecord('category', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error('Failed to update category');
      }
      
      const updated = successfulUpdates[0]?.data;
      return {
        ...updated,
        recipient_ids: updated.recipient_ids ? updated.recipient_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
      };
    }
  }

  async delete(id) {
    if (!this.apperClient) this.initializeClient();
    
    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await this.apperClient.deleteRecord('category', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return true;
  }
}

export const categoryService = new CategoryService();