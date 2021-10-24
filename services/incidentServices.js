const MongoLib = require('../lib/mongo');

class IncidentService {
  constructor() {
    this.collection = 'incidents';
    this.mongoDB = new MongoLib();
  }

  async getIncidents() {
    const incidents = await this.mongoDB.getAll(this.collection);
    return incidents || [];
  }

  async getIncident({ incidentId }) {
    const incident = await this.mongoDB.get(this.collection, incidentId);
    return incident || {};
  }

  async createIncident({ newCreated_ts, NewUser, NewPermalink , NewChannel}) {
    var newIncident = { 
        created_ts: newCreated_ts, 
        created_user: NewUser, 
        permalink: NewPermalink,
        channel: NewChannel,
        createdAt: new Date()
    };
    const createincidentId = await this.mongoDB.create(this.collection, newIncident);
    return createincidentId;
  }

  async closeIncident({ created_ts_id, close_user_slack, messages_slack } = {}) {
   
    let data = {
      close_user: close_user_slack, 
      messages: messages_slack,
      updatedAt :new Date()
    }
    const updatedincidentId = await this.mongoDB.update(
      this.collection,
      created_ts_id,
      data
    );
  

/*    const updatedincidentId =  await this.mongoDB.update(this.collection).updateOne(
        { created_ts: created_ts_id },
        {
          $set: { close_user: close_user_slack, 
            messages: messages_slack 
        },
          $currentDate: { lastModified: true }
        }
      );*/

    
    return updatedincidentId;
  }

  async deleteIncident({ incidentId }) {
    const deletedIncidentId = await this.mongoDB.delete(this.collection, incidentId);
    return deletedIncidentId;
  }
}

module.exports = IncidentService;