import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.get('/login',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

router.get('/logout',(req,res) =>{
    req.logout()

    res.redirect('/')
});

router.get( '/login/callback',
    passport.authenticate( 'google', {
      scope: ['profile'],
        successRedirect: '/',
        failureRedirect: '/login/failure'
    }));

router.get('/google/redirect', passport.authenticate('google'), (req, res) =>{
    res.redirect('/profile')
});

export default router
