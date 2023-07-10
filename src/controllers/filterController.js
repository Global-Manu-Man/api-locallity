const db = require('../database/db');

exports.selectAll = (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10; 

  const offset = (page - 1) * limit;

  const countQuery = 'SELECT COUNT(*) AS total_count FROM negocio'; // Query to get the total count of records

  const selectQuery = `
    SELECT negocio.*, GROUP_CONCAT(DISTINCT images.image_url) AS image_urls, logos.logo_url
    FROM negocio
    LEFT JOIN images ON negocio.id_business = images.id_business
    LEFT JOIN logos ON negocio.id_business = logos.id_business
    GROUP BY negocio.id_business, logos.logo_url
    LIMIT ${limit}
    OFFSET ${offset}
  `; 

  db.query(countQuery, (countErr, countResult) => {
    if (countErr) {
      return res.status(500).json({ message: 'Failed to retrieve data count', error: countErr });
    }

    const totalCount = countResult[0].total_count; 
    db.query(selectQuery, (selectErr, data) => {
      if (selectErr) {
        return res.status(500).json({ message: 'Failed to retrieve data', error: selectErr });
      }

      if (data.length > 0) {
        res.status(200).json({
          message: 'Paginated Business Data',
          data: data,
          page: page,
          limit: limit,
          total_count: totalCount
        });
      } else {
        res.status(404).json({ message: 'No Business Data Available!' });
      }
    });
  });
};

exports.searchBar=(req, res)=>{


  const name = req.body['name'];
  const searchSql = `SELECT * FROM negocio WHERE name LIKE '%${name}%'`;
  db.query(searchSql,(err, data)=>{


    if(err){

      res.status(500).json({ message: 'Failed to retrieve data', error: err });

    }else if(data.length === 0){

      res.status(404).json({ message: 'No Business Data Available!' });

    }else{

      res.status(200).json({
        message: 'Business Data',
        data: data,
      });

    }



  })


}

exports.filter = (req, res) => {
  let filterQuery = `SELECT n.*, GROUP_CONCAT(i.image_url) AS image_urls, l.logo_url
    FROM negocio n
    JOIN images i ON n.id_business = i.id_business
    JOIN logos l ON n.id_business = l.id_business`;

  const filterParams = {
    shipping: req.body['shipping'],
    bill: req.body['bill'],
    physical_store: req.body['physical_store'],
    online_store: req.body['online_store'],
    category: req.body['category'],
    subcategory: req.body['subcategory'],
    is_owner_verified: req.body['is_owner_verified']
  };

  const values = [];
  let whereClause = false;

  Object.entries(filterParams).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      if (!whereClause) {
        filterQuery += ' WHERE';
        whereClause = true;
      } else {
        filterQuery += ' AND';
      }
      filterQuery += ` ${key} = ?`;
      values.push(value);
    }
  });

  filterQuery += ' GROUP BY n.id_business';

  db.query(filterQuery, values, (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Failed to retrieve data', error: err });
    } else if (data.length === 0) {
      res.status(404).json({ message: 'No Business Data Available!' });
    } else {
      res.status(200).json({
        message: 'Filter Business Data',
        data: data,
      });
    }
  });
};
