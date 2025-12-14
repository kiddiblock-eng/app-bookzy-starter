class ProviderBase {
  constructor(config) {
    this.config = config;
  }

  isConfigured() {
    return false;
  }

  async createPayment(data) {
    throw new Error('createPayment must be implemented');
  }

  async verifyPayment(transactionId) {
    throw new Error('verifyPayment must be implemented');
  }
}

export default ProviderBase;