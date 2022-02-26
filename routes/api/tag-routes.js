const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint


//NOT WORKING  
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
    include:({model:Product})
  })
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});
  // find all tags
  // be sure to include its associated Product data
  

// GET a single tag by id WORKING
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      // JOIN with Product, using the ProductTag through table
      include: [{ model: Product, through: ProductTag, as: 'tag__product' }]
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err);
  }
});



// create a new tag WORKING
router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});


//update an existing tag not working 
router.put('/:id', (req, res) => {
  // update product data
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return Tag.findAll({ where: { product_id: req.params.id } });
    })
    .then((tags) => {
      // get list of current tag_ids
      const tagIds = tags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newTags = req.body.tagIds
        .filter((tag_id) => !tagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const tagToUpdate = tags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        Tag.update({ where: { id: tagToUpdate } }),
        Tag.bulkCreate(newTags),
      ]);
    })
    .then((updatedTags) => res.json(updatedTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

//delete tag passing its id WORKING
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
//check if the id the user insert is present in the database 
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
