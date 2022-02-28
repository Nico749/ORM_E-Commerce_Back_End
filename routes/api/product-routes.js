const router = require('express').Router();
const res = require('express/lib/response');
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products WORKING
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

// get one product WORKING 
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

// CREATE a product WORKING 
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

// // create new product PROBLEM WITH REQ.BODY 
// router.post('/', async (req, res) => {
   
  
//   /* req.body should look like this...
//     {
//       product_name: "Basketball",
//       price: 200.00,
//       stock: 3,
//       tagIds: [1, 2, 3, 4]
//     }
//   */
//   Product.create({
//     product_name:req.body.product_name,
//     price:req.body.price,
//     stock:req.body.stock,
//     tagIds:req.body.tagIds
//   })
//     .then((product) => {
//       // if there's product tags, we need to create pairings to bulk create in the ProductTag model
//       if (req.body.tagIds.length) {
//         const productTagIdArr = req.body.tagIds.map((tag_id) => {
//           return {
//             product_id: product.id,
//             tag_id,
//           };
//         });
//         return ProductTag.bulkCreate(productTagIdArr);
//       }
//       // if no product tags, just respond
//       res.status(200).json(product);
//     })
//     .then((productTagIds) => res.status(200).json(productTagIds))
//     .catch((err) => {
//       console.log(err);
//       res.status(400).json(err);
//     });
// });

//updating an existing product WORKING
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

//delete a product WORKING 
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
