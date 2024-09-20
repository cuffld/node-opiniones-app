import express from 'express'
import { param, body, validationResult, matchedData } from 'express-validator'
import Product from '../models/product.model.js'

const router = express.Router()



router.get('/productos/:id', param('id').isString().trim().notEmpty(), async (req, res) =>{
    try{
	    const {id} = matchedData(req);
	    const product = await Product.findById(id);
    if(product.verified){
        if(req.user === undefined){
            return res.render("comment-full.ejs", {user: false, data});
        }
        res.render("comment-full.ejs", {user: req.user, post: product})
    }else{
        return res.redirect('/')
    }
    }catch(e){
	    res.status(500).json({message: e.message});
    }
})

//TODO validation results
router.post('/user', body('com').isString().trim().notEmpty().escape(), async (req, res) => {
    try{
        const valResult = validationResult(req)
        if(!valResult.isEmpty()){
            return res.status(400).send({errors: valResult.array()})
        }
        const data = matchedData(req) // matches data like "req.body" but validated
        const productSave = await new Product({
            comment: data.com,
            userId: req.user.id,
        }).save().then(() =>{
            res.sendStatus(200)
	    })
    }catch(e){
        res.status(500).json({message: e.message})
    }
});


// return all comment of user
router.get('/user/comentarios/:id', param('id').isString().trim().notEmpty(), async (req, res) =>{
    try{
        const valResult = validationResult(req)
        const {id} = matchedData(req)
        if(!valResult.isEmpty()){
            return res.status(400).send({errors: valResult.array()})
        }
        const myComments = await Product.find({userId: id})
        res.render("mycoms", { myComments })
    }catch(e){
        res.status(500).json({message: e.message})
    }
})

//TODO i don't think this part need to has validations because it's only accesable to admins
router.put('/user/verify/', async (req, res) =>{
    try{
        const id = req.body;
        Object.keys(id).forEach(async prop => await Product.updateOne({ _id: prop }, {$set: { verified: id[prop] }})) // NOTE bad because 'forEach' loop is not for async functions better to use 'for' or 'map'
        res.sendStatus(200)
    }catch(e){
        res.status(500).json({message: e.message})
    }
})
//TODO validation but i think it's not too necesary here
router.put('/posts/:postId/:likeOrUnlike', [param('postId').isString().trim().notEmpty(), param('likeOrUnlike').isString().trim().notEmpty() ], (req, res)=>{
    try{
    const postId = req.params.postId
    const likeOrDisklike = req.params.likeOrUnlike
    const userRef = req.user._id
    if (likeOrDisklike === "like"){
        Product.findByIdAndUpdate({_id: postId }, {$push:{likedBy: userRef}})
               .then(() =>{
                res.sendStatus(200)
               })
    }else if (likeOrDisklike === "unlike"){
        Product.findByIdAndUpdate({_id: postId}, {$pull:{likedBy: userRef}})
               .then(() =>{
                   res.sendStatus(200)
               })
    }
    }catch(e){
            res.status(422).json({message: e.message})
        }
    }
)

// router.put('/product/:id', async (req, res) =>{
//     try{
// 	const {id} = req.params;
// 	const product = await Product.findByIdAndUpdate(id, req.body);
// 	if(!product){
// 	    return res.send(404).json({message: "comment not posted"});
// 	}
// 	const updateProduct = await Product.findById(id);
// 	res.status(200).json(updateProduct);
//     }catch(e){
// 	res.status(500).json({message: e.message})
//     }
// })

export default router
