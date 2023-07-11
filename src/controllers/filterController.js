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

exports.filter=(req,res)=>{

 const shipping = req.body['shipping']
 const bill = req.body['bill']
 const physical_store = req.body['physical_store']
 const online_store = req.body['online_store']
 const category = req.body['category']
 const subcategory = req.body['subcategory']
 const is_owner_verified = req.body['is_owner_verified']
 const page = req.query.page || 1;
 const limit = req.query.limit || 10; 
 const offset = (page - 1) * limit;

  // const filterParams = {
  //   shipping: req.body['shipping'],
  //   bill: req.body['bill'],
  //   physical_store: req.body['physical_store'],
  //   online_store: req.body['online_store'],
  //   category: req.body['category'],
  //   subcategory: req.body['subcategory'],
  //   is_owner_verified: req.body['is_owner_verified']
  // };
  const countQuery = 'SELECT COUNT(*) AS total_count FROM negocio';
 


    db.query(countQuery, (countErr, countResult) => {

      const totalCount = countResult[0].total_count; 

      if (countErr) {
        return res.status(500).json({ message: 'Failed to retrieve data count', error: countErr });
      }

      if(totalCount > 0){

        db.query(filterQuery,(err, data)=>{

          if(err){
      
            res.status(500).json({ message: 'Failed to retrieve data', error: err });
      
          }else if(data.length === 0){
      
            res.status(404).json({ message: 'No Business Data Available!' });
      
          }else{
      
            res.status(200).json({
              message: 'Filter Business Data',
              data: data,
              page: page,
              limit: limit,
              total_count: totalCount
            });
      
          }
      
      
        })
      }

    })
  let filterQuery = `SELECT n.*, GROUP_CONCAT(i.image_url) AS image_urls, l.logo_url
  FROM negocio n
  JOIN images i ON n.id_business = i.id_business
  JOIN logos l ON n.id_business = l.id_business
  WHERE n.shipping = ${shipping}
  AND n.physical_store = ${physical_store}
  AND n.online_store = ${online_store}
  AND n.is_owner_verified = ${is_owner_verified}
  AND n.subcategory = '${subcategory}'
  AND n.category = '${category}'
  AND n.bill = ${bill}
  GROUP BY n.id_business
  LIMIT ${limit}
  OFFSET ${offset}
  `;


    // const values = [];
    // ```online_store``category``subcategory``is_owner_verified``bill`
    // let whereClause = false;

    // Object.entries(filterParams).forEach(([key, value]) => {
    //   if (value) {
    //     if (!whereClause) {
    //       filterQuery += ' WHERE';
    //       whereClause = true;
    //     } else {
    //       filterQuery += ' AND';
    //     }
    //     filterQuery += ` ${key} = '${value}'`;
    //     values.push(value);

     
    //   }
    // });
 


}
