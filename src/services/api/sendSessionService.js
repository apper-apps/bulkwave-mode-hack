class SendSessionService {
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
    if (!this.apperClient) {
      this.initializeClient();
      if (!this.apperClient) {
        console.error('SendSessionService.getAll: ApperClient initialization failed');
        throw new Error('Failed to initialize API client');
      }
    }
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "message_id" } },
        { field: { Name: "recipient_ids" } },
        { field: { Name: "speed" } },
        { field: { Name: "ban_protection" } },
        { field: { Name: "status" } },
        { field: { Name: "progress" } },
        { field: { Name: "started_at" } },
        { field: { Name: "completed_at" } }
      ]
    };

    try {
      const response = await this.apperClient.fetchRecords('send_session', params);

      // Handle null/undefined response
      if (!response) {
        console.error('SendSessionService.getAll: Received null or undefined response from API');
        throw new Error('Failed to fetch send sessions - no response from server');
      }

      // Handle failed response
      if (!response.success) {
        const errorMessage = response.message || 'Operation failed';
        console.error(`SendSessionService.getAll: API returned error - ${errorMessage}`);
        throw new Error(errorMessage);
      }

      // Handle missing or invalid data
      if (!response.data) {
        console.warn('SendSessionService.getAll: Response success but no data field present');
        return [];
      }

      return response.data.map(session => ({
        ...session,
        recipient_ids: session.recipient_ids ? session.recipient_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
      }));
    } catch (error) {
      console.error('SendSessionService.getAll: Exception during API call:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('no response from server')) {
        throw error;
      }
      throw new Error(`Failed to fetch send sessions: ${error.message}`);
    }
  }

async getById(id) {
    if (!this.apperClient) {
      this.initializeClient();
      if (!this.apperClient) {
        console.error(`SendSessionService.getById: ApperClient initialization failed for ID ${id}`);
        throw new Error('Failed to initialize API client');
      }
    }
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "message_id" } },
        { field: { Name: "recipient_ids" } },
        { field: { Name: "speed" } },
        { field: { Name: "ban_protection" } },
        { field: { Name: "status" } },
        { field: { Name: "progress" } },
        { field: { Name: "started_at" } },
        { field: { Name: "completed_at" } }
      ]
    };

    try {
      const response = await this.apperClient.getRecordById('send_session', parseInt(id), params);

      // Handle null/undefined response
      if (!response) {
        console.error(`SendSessionService.getById: Received null or undefined response from API for ID ${id}`);
        throw new Error(`Failed to fetch send session ${id} - no response from server`);
      }

      // Handle failed response
      if (!response.success) {
        const errorMessage = response.message || 'Operation failed';
        console.error(`SendSessionService.getById: API returned error for ID ${id} - ${errorMessage}`);
        throw new Error(errorMessage);
      }

      // Handle missing data
      if (!response.data) {
        console.error(`SendSessionService.getById: Response success but no data field present for ID ${id}`);
        throw new Error(`Send session ${id} not found`);
      }

      const session = response.data;
      return {
        ...session,
        recipient_ids: session.recipient_ids ? session.recipient_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
      };
    } catch (error) {
      console.error(`SendSessionService.getById: Exception during API call for ID ${id}:`, error);
      if (error.message.includes('Failed to fetch') || error.message.includes('no response from server') || error.message.includes('not found')) {
        throw error;
      }
      throw new Error(`Failed to fetch send session ${id}: ${error.message}`);
    }
  }

async create(sessionData) {
    if (!this.apperClient) {
      this.initializeClient();
      if (!this.apperClient) {
        console.error('SendSessionService.create: ApperClient initialization failed');
        throw new Error('Failed to initialize API client');
      }
    }
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: sessionData.Name || sessionData.message_id || `Session ${Date.now()}`,
        Tags: sessionData.Tags || '',
        Owner: sessionData.Owner,
        message_id: sessionData.message_id,
        recipient_ids: Array.isArray(sessionData.recipient_ids) ? sessionData.recipient_ids.join(',') : sessionData.recipient_ids || '',
        speed: sessionData.speed,
        ban_protection: sessionData.ban_protection,
        status: sessionData.status,
        progress: sessionData.progress || 0,
        started_at: sessionData.started_at,
        completed_at: sessionData.completed_at || null
      }]
    };

    try {
      const response = await this.apperClient.createRecord('send_session', params);

      if (!response.success) {
        console.error('SendSessionService.create: API returned error:', response.message || 'Operation failed');
        throw new Error(response.message || 'Operation failed');
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`SendSessionService.create: Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create send session');
        }
        
        const created = successfulRecords[0]?.data;
        return {
          ...created,
          recipient_ids: created.recipient_ids ? created.recipient_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
        };
      }
    } catch (error) {
      console.error('SendSessionService.create: Exception during API call:', error);
      if (error.message.includes('Failed to initialize') || error.message.includes('Failed to create')) {
        throw error;
      }
      throw new Error(`Failed to create send session: ${error.message}`);
    }
  }

async update(id, updates) {
    if (!this.apperClient) {
      this.initializeClient();
      if (!this.apperClient) {
        console.error(`SendSessionService.update: ApperClient initialization failed for ID ${id}`);
        throw new Error('Failed to initialize API client');
      }
    }
    
    // Only include Updateable fields
    const updateData = {
      Id: parseInt(id)
    };
    
    if (updates.Name !== undefined) updateData.Name = updates.Name;
    if (updates.Tags !== undefined) updateData.Tags = updates.Tags;
    if (updates.Owner !== undefined) updateData.Owner = updates.Owner;
    if (updates.message_id !== undefined) updateData.message_id = updates.message_id;
    if (updates.recipient_ids !== undefined) {
      updateData.recipient_ids = Array.isArray(updates.recipient_ids) ? updates.recipient_ids.join(',') : updates.recipient_ids;
    }
    if (updates.speed !== undefined) updateData.speed = updates.speed;
    if (updates.ban_protection !== undefined) updateData.ban_protection = updates.ban_protection;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.progress !== undefined) updateData.progress = updates.progress;
    if (updates.started_at !== undefined) updateData.started_at = updates.started_at;
    if (updates.completed_at !== undefined) updateData.completed_at = updates.completed_at;

    const params = {
      records: [updateData]
    };

    try {
      const response = await this.apperClient.updateRecord('send_session', params);

      if (!response.success) {
        console.error(`SendSessionService.update: API returned error for ID ${id}:`, response.message || 'Operation failed');
        throw new Error(response.message || 'Operation failed');
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`SendSessionService.update: Failed to update ${failedUpdates.length} records for ID ${id}:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update send session');
        }
        
        const updated = successfulUpdates[0]?.data;
        return {
          ...updated,
          recipient_ids: updated.recipient_ids ? updated.recipient_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
        };
      }
    } catch (error) {
      console.error(`SendSessionService.update: Exception during API call for ID ${id}:`, error);
      if (error.message.includes('Failed to initialize') || error.message.includes('Failed to update')) {
        throw error;
      }
      throw new Error(`Failed to update send session ${id}: ${error.message}`);
    }
  }

async delete(id) {
    if (!this.apperClient) {
      this.initializeClient();
      if (!this.apperClient) {
        console.error(`SendSessionService.delete: ApperClient initialization failed for ID ${id}`);
        throw new Error('Failed to initialize API client');
      }
    }
    
    const params = {
      RecordIds: [parseInt(id)]
    };

    try {
      const response = await this.apperClient.deleteRecord('send_session', params);

      if (!response.success) {
        console.error(`SendSessionService.delete: API returned error for ID ${id}:`, response.message || 'Operation failed');
        throw new Error(response.message || 'Operation failed');
      }

      return true;
    } catch (error) {
      console.error(`SendSessionService.delete: Exception during API call for ID ${id}:`, error);
      if (error.message.includes('Failed to initialize')) {
        throw error;
      }
      throw new Error(`Failed to delete send session ${id}: ${error.message}`);
    }
  }
}

export const sendSessionService = new SendSessionService();