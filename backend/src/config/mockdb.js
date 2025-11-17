// Mock In-Memory Database
let contacts = [];
let contactId = 1;

const mockDB = {
  // Create contact
  createContact: async (data) => {
    const contact = {
      _id: `contact_${contactId++}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    contacts.push(contact);
    return contact;
  },

  // Get all contacts with filter and pagination
  getContacts: async (filter = {}, skip = 0, limit = 10) => {
    let result = contacts;

    // Apply filter
    if (filter.status) {
      result = result.filter((c) => c.status === filter.status);
    }

    // Pagination
    const total = result.length;
    const paginatedResult = result
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + limit);

    return {
      data: paginatedResult,
      total,
    };
  },

  // Get contact by ID
  getContactById: async (id) => {
    return contacts.find((c) => c._id === id);
  },

  // Update contact
  updateContact: async (id, data) => {
    const index = contacts.findIndex((c) => c._id === id);
    if (index === -1) return null;

    contacts[index] = {
      ...contacts[index],
      ...data,
      updatedAt: new Date(),
    };
    return contacts[index];
  },

  // Delete contact
  deleteContact: async (id) => {
    const index = contacts.findIndex((c) => c._id === id);
    if (index === -1) return null;

    const deleted = contacts[index];
    contacts.splice(index, 1);
    return deleted;
  },

  // Get all (for testing)
  getAllContacts: () => contacts,

  // Reset (for testing)
  reset: () => {
    contacts = [];
    contactId = 1;
  },
};

module.exports = mockDB;
