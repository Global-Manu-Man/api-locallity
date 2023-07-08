const db = require('../database/db');

exports.selectAll = (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 2; 

  const offset = (page - 1) * limit;

  const countQuery = 'SELECT COUNT(*) AS total_count FROM negocio'; // Query to get the total count of records

  const selectQuery = `
    SELECT negocio.*, GROUP_CONCAT(DISTINCT images.image_url) AS image_urls, logos.logo_url
    FROM negocio
    LEFT JOIN images ON negocio.id_business = images.id_business
    LEFT JOIN logos ON negocio.id_business = logos.id_business
    GROUP BY negocio.id_business
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
