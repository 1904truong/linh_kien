const Supplier = require('../../infrastructure/database/models/Supplier');

class SupplierController {
  async getSuppliers(req, res) {
    try {
      const { status } = req.query;
      const query = status ? { status } : { status: 'approved' };
      const suppliers = await Supplier.find(query).sort({ createdAt: -1 });
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createSupplier(req, res) {
    try {
      const supplier = new Supplier({
        ...req.body,
        status: 'approved' // Admin created are approved by default
      });
      await supplier.save();
      res.status(201).json(supplier);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async requestSupplier(req, res) {
    try {
      const supplier = new Supplier({
        ...req.body,
        status: 'pending',
        requestedBy: req.user.userId
      });
      await supplier.save();
      res.status(201).json(supplier);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async approveSupplier(req, res) {
    try {
      const { id } = req.params;
      const supplier = await Supplier.findByIdAndUpdate(
        id,
        { $set: { status: 'approved', isVerified: true } },
        { new: true }
      );
      if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async rejectSupplier(req, res) {
    try {
      const { id } = req.params;
      const supplier = await Supplier.findByIdAndUpdate(
        id,
        { $set: { status: 'rejected' } },
        { new: true }
      );
      if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateSupplier(req, res) {
    try {
      const { id } = req.params;
      const updatedSupplier = await Supplier.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      if (!updatedSupplier) return res.status(404).json({ message: 'Supplier not found' });
      res.json(updatedSupplier);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteSupplier(req, res) {
    try {
      const { id } = req.params;
      const deletedSupplier = await Supplier.findByIdAndDelete(id);
      if (!deletedSupplier) return res.status(404).json({ message: 'Supplier not found' });
      res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new SupplierController();
