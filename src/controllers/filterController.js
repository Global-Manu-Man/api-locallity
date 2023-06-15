const db = require('../database/db');

exports.selectAll=(req,res)=>{


    const sql = `SELECT negocio.*, GROUP_CONCAT(DISTINCT images.image_url) AS image_urls, logos.logo_url
    FROM negocio
    LEFT JOIN images ON negocio.id_business = images.id_business
    LEFT JOIN logos ON negocio.id_business = logos.id_business
    GROUP BY negocio.id_business
    
    `

    db.query(sql,(err,data)=>{

        if(data.length > 0){

            if(err){

                res.status(404).json({ message:"Failed to retrive data",error:err})
    
            }else{

                console.log(data.length)
    
                res.status(200).json({ message:"All Bussiness Data",data:data})
    
            }
        }else{

            res.status(404).json({ message:"No Business Data Available!"})

        }


    })

}