const Product = require("../models/Product");

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    let filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    let sortOption = {};

    if (req.query.sort) {
      sortOption[req.query.sort] = 1;
    } else {
      sortOption.createdAt = -1;
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: products
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (
  req,
  res,
  next
) => {
  try {
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product deleted"
    });
  } catch (err) {
    next(err);
  }
};

exports.adjustStock = async (
  req,
  res,
  next
) => {
  try {
    const { change } = req.body;

    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    product.quantity += change;

    if (product.quantity < 0) {
      product.quantity = 0;
    }

    await product.save();

    res.json({
      success: true,
      message: "Stock updated",
      data: product
    });
  } catch (err) {
    next(err);
  }
};

exports.getLowStock = async (
  req,
  res,
  next
) => {
  try {
    const products = await Product.find({
      $expr: {
        $lte: [
          "$quantity",
          "$reorderLevel"
        ]
      }
    });

    res.json({
      success: true,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

exports.categorySummary = async (
  req,
  res,
  next
) => {
  try {
    const summary =
      await Product.aggregate([
        {
          $group: {
            _id: "$category",
            totalProducts: {
              $sum: 1
            },
            totalQuantity: {
              $sum: "$quantity"
            },
            totalStockValue: {
              $sum: {
                $multiply: [
                  "$quantity",
                  "$price"
                ]
              }
            }
          }
        }
      ]);

    res.json({
      success: true,
      data: summary
    });
  } catch (err) {
    next(err);
  }
};