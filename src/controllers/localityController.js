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
    
   const business_id = req.params.id;

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


   const UpdateSql = `UPDATE negocio SET name='[value-3]',price='[value-4]',manager='[value-5]',description='[value-6]',address_1='[value-7]',address_2='[value-8]',address_3='[value-9]',city='[value-10]',state='[value-11]',country='[value-12]',postal_code='[value-13]',latitude='[value-14]',longitude='[value-15]',delivery='[value-16]',shipping='[value-17]',bill='[value-18]',antiquity='[value-19]',email='[value-20]',physical_store='[value-21]',online_store='[value-22]',url_google='[value-23]',cell_phone_number='[value-24]',business_days='[value-25]',category='[value-26]',subcategory='[value-27]',discount_code='[value-28]',publication_likes='[value-29]',questions='[value-30]',policies_terms='[value-31]',accepts_credit_cards='[value-32]',is_owner_verified='[value-33]',language='[value-34]',social_networks='[value-35]',status='[value-36]',start_date='[value-38]',end_date='[value-39]' WHERE business_id ="${business_id}"`

   db.query(UpdateSql,(err,data)=>{


       if(err){
         // error

       }else{
        // data

       }

   })
}
