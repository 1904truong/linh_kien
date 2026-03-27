const Supplier = require('../../../infrastructure/database/models/Supplier');
const SupplierRequest = require('../../../infrastructure/database/models/SupplierRequest');

// Generic helper to seed database if empty
const seedSuppliersIfEmpty = async () => {
  const count = await Supplier.countDocuments();
  if (count === 0) {
    await Supplier.insertMany([
      {
        name: 'AutoPart Global - Nhà cung cấp số 1',
        logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
        rating: 4.9,
        reviewsCount: 1250,
        location: 'Quận 7, TP. HCM',
        deliveryTime: '2-4 giờ',
        isVerified: true,
        categories: ['Hệ thống phanh', 'Động cơ', 'Gầm máy'],
        description: 'Chuyên cung cấp linh kiện chính hãng cho các dòng xe Đức và Nhật.'
      },
      {
        name: 'Phụ tùng Thủ Đô - Tổng kho miền Bắc',
        logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&h=100&fit=crop',
        rating: 4.8,
        reviewsCount: 840,
        location: 'Long Biên, Hà Nội',
        deliveryTime: '1-3 ngày',
        isVerified: true,
        categories: ['Lốp xe', 'Ắc quy', 'Dầu nhớt'],
        description: 'Đối tác chiến lược của Michelin và Castrol tại Việt Nam.'
      },
      {
        name: 'Linh kiện Xuyên Việt',
        logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop',
        rating: 4.5,
        reviewsCount: 420,
        location: 'Hải Châu, Đà Nẵng',
        deliveryTime: '24 giờ',
        isVerified: false,
        categories: ['Nội thất', 'Phụ kiện', 'Đèn xe'],
        description: 'Cung cấp sỉ và lẻ các loại đèn LED và đồ chơi xe hơi.'
      }
    ]);
    console.log('Seeded initial suppliers logic.');
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    // Seed for demo purposes
    await seedSuppliersIfEmpty();

    const { search } = req.query;
    let query = { status: 'active' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { categories: { $regex: search, $options: 'i' } }
      ];
    }

    const suppliers = await Supplier.find(query).sort({ isVerified: -1, rating: -1 });

    res.status(200).json({
      success: true,
      data: suppliers
    });

  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tìm kiếm nguồn hàng.' });
  }
};

exports.createSupplierRequest = async (req, res) => {
  try {
    const sellerId = req.user.userId;
    const { name, location, categories, description } = req.body;

    if (!name || !location || !categories) {
      return res.status(400).json({ success: false, message: 'Bắt buộc điền Tên, Vị trí và Danh mục.' });
    }

    let categoryArray = categories;
    if (typeof categories === 'string') {
      categoryArray = categories.split(',').map(c => c.trim()).filter(Boolean);
    }

    const request = new SupplierRequest({
      sellerId,
      name,
      location,
      categories: categoryArray,
      description
    });

    await request.save();

    res.status(201).json({
      success: true,
      message: 'Đề xuất nhà cung cấp đã được gửi tới Admin thành công.',
      data: request
    });

  } catch (error) {
    console.error('Error creating supplier request:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi gửi yêu cầu.' });
  }
};
