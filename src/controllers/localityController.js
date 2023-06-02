const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const env =  require('dotenv').config()
const multer = require('multer');
const AWS = require('aws-sdk');

const uploadToS3 = require('../middlewares/imageUpload');


exports.create=(request,response)=>{


   const business_id = uuidv4().slice(0,10);
   const name = request.body['name'];
   const price = request.body['price'];
   const manager = request.body['manager'];
   const description = request.body['description'];
   const capacity_people = request.body['capacity_people'];
   const address_1 = request.body['address_1'];
   const address_2 = request.body['address_2'];
   const address_3 = request.body['address_3'];
   const city = request.body['city'];
   const state = request.body['state'];
   const country = request.body['country'];
   const postal_code = request.body['postal_code'];
   const email = request.body['email'];
   const cell_phone_number = request.body['cell_phone_number'];
   const publication_likes = request.body['publication_likes'];
   const questions = request.body['questions'];
   const policies_terms = request.body['policies_terms'];
   const delivery = request.body['delivery'];
   const shipping = request.body['shipping'];
   const bill  = request.body['bill'];
   const antiquity = request.body['antiquity'];
   const physical_store = request.body['physical_store'];
   const online_store = request.body['online_store'];
   const url_google = request.body['url_google'];
   const business_days = request.body['business_days'];
   const category = request.body['category'];
   const subcategory = request.body['subcategory'];
   const discount_code = request.body['discount_code'];
   const latitude = request.body['latitude'];
   const longitude = request.body['longitude'];
   const accepts_credit_cards = request.body['accepts_credit_cards'];
   const is_owner_verified = request.body['is_owner_verified'];
   const start_date = request.body['start_date'];
   const end_date = request.body['end_date'];
   const language = request.body['language'];
   const status = request.body['status'];
   const social_networks = request.body['social_networks'];
   const startDate = new Date(start_date);
   const endDate = new Date(end_date);
   const startTime = startDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
   const endTime = endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
   const schedule = startTime+"-"+endTime;
   const created_at = new Date();


        // Image
        if(request.files && request.files.length>0 ){

            for(let i=0;i<request.files.length;i++){

             
                uploadToS3(request.files[i].buffer).then((result)=>{

                    const imgLocation = result.Location;
                  
                    const ImageSql = `INSERT INTO images(images_id, image_url) VALUES ("${business_id}","${imgLocation}")`;
                    db.query(ImageSql)

              })
            }
          
        }


        const sql = `INSERT INTO negocio (business_id, schedule, name, price, manager, description, address_1, address_2, address_3, city, state, country, postal_code,latitude, longitude,delivery, shipping, bill, antiquity, email, physical_store, online_store, url_google, cell_phone_number, business_days, category, subcategory, discount_code, publication_likes, questions, policies_terms, accepts_credit_cards, is_owner_verified, language, social_networks, status, created_at, start_date, end_date) VALUES ('${business_id}','${schedule}','${name}','${price}','${manager}','${description}','${address_1}','${address_2}','${address_3}','${city}','${state}','${country}','${postal_code}','${latitude}','${longitude}','${delivery}','${shipping}','${bill}','${antiquity}','${email}','${physical_store}','${online_store}','${url_google}','${cell_phone_number}','${business_days}','${category}','${subcategory}','${discount_code}','${publication_likes}','${questions}','${policies_terms}','${accepts_credit_cards}','${is_owner_verified}','${language}','${social_networks}','${status}','${created_at}','${start_date}','${end_date}')`;

        db.query(sql, (err,data)=>{

            if(data){

                response.status(200).json({
                    code:200,
                    business_id:business_id,
                    message:"Data Inserted SuccessFully",})

            }else{

                response.status(400).json({
                    code:400 ,
                    message:"Data Insert failed",
                    error:err
                })

            }


        })

   
}

exports.getItems=(req,res)=>{


    const business_id = req.params.id;

    const sql = `SELECT * FROM negocio WHERE business_id = "${business_id}"`
    const img_sql = `SELECT * FROM images WHERE images_id = "${business_id}"`

    db.query(sql,(err,data)=>{

        if(err){

            res.status(404).json({
                code:404 ,
                message:"Data Not Found",
                error:err
            })

        }else if(data.length === 0){

            res.status(404).json({message: "no record record found"})

        }else{

            db.query(img_sql,(err,images)=>{

                if(err){
                    
                    res.status(404).json({
                        code:404 ,
                        message:"Data Not Found",
                        error:err
                    })
                }

                const imageUrls = images && images.length > 0 ? images.map((row) => row.image_url) : [];

                    res.status(200).json({
                        code:200 ,
                        message:"Data Found",
                        data:{
                            business_details:data,
                            images:imageUrls
                        }
                    })
                

            })

        }
    })

}

exports.UpdateData=(req,res)=>{
    
   const business_id = req.body['business_id'];
   const name = req.body['name'];
   const price = req.body['price'];
   const manager = req.body['manager'];
   const description = req.body['description'];
   const capacity_people = req.body['capacity_people'];
   const address_1 = req.body['address_1'];
   const address_2 = req.body['address_2'];
   const address_3 = req.body['address_3'];
   const city = req.body['city'];
   const state = req.body['state'];
   const country = req.body['country'];
   const postal_code = req.body['postal_code'];
   const email = req.body['email'];
   const cell_phone_number = req.body['cell_phone_number'];
   const publication_likes = req.body['publication_likes'];
   const questions = req.body['questions'];
   const policies_terms = req.body['policies_terms'];
   const delivery = req.body['delivery'];
   const shipping = req.body['shipping'];
   const bill  = req.body['bill'];
   const antiquity = req.body['antiquity'];
   const physical_store = req.body['physical_store'];
   const online_store = req.body['online_store'];
   const url_google = req.body['url_google'];
   const business_days = req.body['business_days'];
   const category = req.body['category'];
   const subcategory = req.body['subcategory'];
   const discount_code = req.body['discount_code'];
   const latitude = req.body['latitude'];
   const longitude = req.body['longitude'];
   const accepts_credit_cards = req.body['accepts_credit_cards'];
   const is_owner_verified = req.body['is_owner_verified'];
   const start_date = req.body['start_date'];
   const end_date = req.body['end_date'];
   const language = req.body['language'];
   const status = req.body['status'];
   const social_networks = req.body['social_networks'];
   const startDate = new Date(start_date);
   const endDate = new Date(end_date);
   const startTime = startDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
   const endTime = endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
   const schedule = startTime+"-"+endTime;
   const created_at = new Date();


const UpdateSql = `UPDATE negocio SET 
                            name='${name}',
                            price='${price}',
                            manager='${manager}',
                            description='${description}',
                            address_1='${address_1}',
                            address_2='${address_2}',
                            address_3='${address_3}',
                            city='${city}',
                            state='${state}',
                            country='${country}',
                            postal_code='${postal_code}',
                            latitude='${latitude}',
                            longitude='${longitude}',
                            delivery='${delivery}',
                            shipping='${shipping}',
                            bill='${bill}',
                            antiquity='${antiquity}',
                            email='${email}',
                            physical_store='${physical_store}',
                            online_store='${online_store}',
                            url_google='${url_google}',
                            cell_phone_number='${cell_phone_number}',
                            business_days='${business_days}',
                            category='${category}',
                            subcategory='${subcategory}',
                            discount_code='${discount_code}',
                            publication_likes='${publication_likes}',
                            questions='${questions}',
                            policies_terms='${policies_terms}',
                            accepts_credit_cards='${accepts_credit_cards}',
                            is_owner_verified='${is_owner_verified}',
                            language='${language}',
                            social_networks='${social_networks}',
                            status='${status}',
                            start_date='${start_date}',
                            end_date='${end_date}'
                   WHERE business_id = '${business_id}'`;

   db.query(UpdateSql,(err,data)=>{

       if(err){
          
        res.status(500).json({message:"data Update failed",error:err})

       }else{

        res.status(200).json({message:"data Updated Successfully",error:data})

       }

   })
}


exports.deleteItem=(req,res)=>{

    const business_id = req.params.id;

    const deleteSql = `DELETE FROM negocio WHERE business_id = '${business_id}'`
    const ImgDelSql = `DELETE FROM images WHERE images_id ='${business_id}'`


    db.query(ImgDelSql,(err,data)=>{

        if(err){

            res.status(400).json({message:"Data Delete Failed",error:err})

        }else{

           db.query(deleteSql)
           res.status(200).json({message:"Data Delete Successfully",error:data})
        }

    })





}
