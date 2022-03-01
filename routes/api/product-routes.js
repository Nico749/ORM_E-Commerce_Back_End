const router = require('express').Router();
const res = require('express/lib/response');
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products 
router.get('/', async (req, res) => {
  try{
    const productData = await Product.findAll({
    include:[{ model:Tag, through:ProductTag, as: 'product__tag'},{model:Category}]
    })
    res.status(200).json(productData)

  } catch(err){
    res.status(500).json(err)
  }
});

// get one product 
router.get('/:id', async (req, res) => {
  try{
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model:Tag, through:ProductTag, as: 'product__tag'},
    {model:Category}]
    })

    if(!productData){
      res.status(404).json({message: 'No product found with this id'})
      return
    }
    res.status(200).json(productData)
  
  }catch(err){
    res.status(500).json(err)
  }
});

// CREATE a product  
router.post('/', async (req, res) => {
  try {
    const productData = await Product.create({
      product_name:req.body.product_name,
      price:req.body.price,
      stock:req.body.stock,
      tagIds:req.body.tagIds
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//updating an existing product 
router.put('/:id', async (req, res) => {
  try {
    const productData = await Product.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    if (!productData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a product 
router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
