const getInventoryStatus = require('../../core/use-cases/GetInventoryStatus');
const updateInventory = require('../../core/use-cases/UpdateInventory');

class InventoryController {
  async getStatus(req, res) {
    try {
      const result = await getInventoryStatus.execute(req.query);
      return res.status(200).json(result);
    } catch (error) {
      console.error(`Inventory Controller Error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error'
      });
    }
  }

  async updateInventory(req, res) {
    try {
      const { id } = req.params;
      const result = await updateInventory.execute(id, req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error(`Inventory Controller (Update) Error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error'
      });
    }
  }
}

module.exports = new InventoryController();
