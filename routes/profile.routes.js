import express from 'express'

const router = express.Router()

const authCheck = (req, res, next) =>{
    if(!req.user){
	res.redirect('/login')
    }
    else{
	next()
    }
}
router.get('/', authCheck, (req, res)=>{
//    res.send('you are logged in as ' + req.user)
    res.render('profile', {user: req.user})
})

export default router;
