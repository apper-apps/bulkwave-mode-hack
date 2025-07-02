class RecipientService {
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
        { field: { Name: "type" } },
        { field: { Name: "phone_number" } },
        { field: { Name: "member_count" } },
        { field: { Name: "last_message_time" } }
      ]
    };

    const response = await this.apperClient.fetchRecords('recipient', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  }

  async getById(id) {
    if (!this.apperClient) this.initializeClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "type" } },
        { field: { Name: "phone_number" } },
        { field: { Name: "member_count" } },
        { field: { Name: "last_message_time" } }
      ]
    };

    const response = await this.apperClient.getRecordById('recipient', parseInt(id), params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return response.data;
  }

  async create(recipientData) {
    if (!this.apperClient) this.initializeClient();
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: recipientData.Name,
        Tags: recipientData.Tags || '',
        Owner: recipientData.Owner,
        type: recipientData.type,
        phone_number: recipientData.phone_number || '',
        member_count: recipientData.member_count || 0,
        last_message_time: recipientData.last_message_time || null
      }]
    };

    const response = await this.apperClient.createRecord('recipient', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error('Failed to create recipient');
      }
      
      return successfulRecords[0]?.data;
    }
  }

  async update(id, updates) {
    if (!this.apperClient) this.initializeClient();
    
    // Only include Updateable fields
    const updateData = {
      Id: parseInt(id)
    };
    
    if (updates.Name !== undefined) updateData.Name = updates.Name;
    if (updates.Tags !== undefined) updateData.Tags = updates.Tags;
    if (updates.Owner !== undefined) updateData.Owner = updates.Owner;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.phone_number !== undefined) updateData.phone_number = updates.phone_number;
    if (updates.member_count !== undefined) updateData.member_count = updates.member_count;
    if (updates.last_message_time !== undefined) updateData.last_message_time = updates.last_message_time;

    const params = {
      records: [updateData]
    };

    const response = await this.apperClient.updateRecord('recipient', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error('Failed to update recipient');
      }
      
      return successfulUpdates[0]?.data;
    }
  }

  async delete(id) {
    if (!this.apperClient) this.initializeClient();
    
    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await this.apperClient.deleteRecord('recipient', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    return true;
  }
}

export const recipientService = new RecipientService();