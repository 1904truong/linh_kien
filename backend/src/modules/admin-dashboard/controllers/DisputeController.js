const Dispute = require('../../../infrastructure/database/models/Dispute');

class DisputeController {
  async getDisputes(req, res) {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const query = {};
      if (status) query.status = status;

      const disputes = await Dispute.find(query)
        .populate('buyerId', 'name email shadowName')
        .populate('sellerId', 'name email shopName')
        .populate('orderId')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const count = await Dispute.countDocuments(query);

      res.json({
        disputes,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalDisputes: count
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDisputeById(req, res) {
    try {
      const dispute = await Dispute.findById(req.params.id)
        .populate('buyerId', 'name email shadowName')
        .populate('sellerId', 'name email shopName')
        .populate('orderId')
        .populate('resolution.resolvedBy', 'name');

      if (!dispute) {
        return res.status(404).json({ error: 'Dispute not found' });
      }

      res.json(dispute);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async resolveDispute(req, res) {
    try {
      const { action, notes } = req.body;
      const disputeId = req.params.id;

      const dispute = await Dispute.findById(disputeId);
      if (!dispute) {
        return res.status(404).json({ error: 'Dispute not found' });
      }

      dispute.status = action === 'rejected' ? 'rejected' : 'resolved';
      dispute.resolution = {
        action,
        notes,
        resolvedAt: new Date(),
        resolvedBy: req.user.userId
      };

      await dispute.save();

      // Here you would typically also trigger order status updates or refunds
      // For now, we just update the dispute status

      res.json({ message: 'Dispute resolved successfully', dispute });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DisputeController();
