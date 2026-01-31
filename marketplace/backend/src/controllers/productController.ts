import { Request, Response } from 'express';
import { Product } from '../models/Product';

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req: any, res: Response) => {
  try {
    // ADDED: imageUrl here so it gets pulled from the frontend request
    const { title, description, price, category, imageUrl } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      category,
      imageUrl, // SAVES THE IMAGE URL
      owner: req.user._id,
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
    // This is correct: it sends both username and email to the frontend
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
      req.body, // This automatically handles title, price, imageUrl, etc.
      { new: true } 
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