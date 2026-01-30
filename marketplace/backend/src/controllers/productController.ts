import { Request, Response } from 'express';
import { Product } from '../models/Product';

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req: any, res: Response) => {
  try {
    const { title, description, price, category } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      category,
      owner: req.user._id, // Set by our 'protect' middleware
    });

    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
export const getProducts = async (req: Request, res: Response) => {
  try {
    // Optional: add .populate('owner', 'username email') to see who owns it
    const products = await Product.find({}).populate('owner', 'username email');
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Check if user is the owner of the resource or an admin
export const isOwnerOrAdmin = async (req: any, res: Response, next: any) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is owner OR admin
    const isOwner = product.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (isOwner || isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized to modify this product' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // This returns the modified document rather than the original
    );
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};