import passport from 'passport'
import googleStrategy from 'passport-google-oauth2'
import User from '../models/user.model.js'
import dotenv from 'dotenv'
dotenv.config()

export const GoogleStrategy = googleStrategy.Strategy

passport.serializeUser((user, done) =>{
    done(null, user.id)
})
passport.deserializeUser((id, done) =>{
  User.findById(id).then((user)=>{
	    done(null, user)
    })
})

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true
},(request, accessToken, refreshToken, profile, done) => {
      User.findOne({googleId: profile.id}).then((currentUser) =>{
	  if(currentUser){
	      //console.log('user is:' + currentUser)
	      done(null, currentUser)
	  }else{
	      new User({
		  username: profile.displayName,
		  googleId: profile.id,
	      }).save().then((newUser) =>{
		  //console.log('new user created' + newUser)
		  done(null, newUser)
	      })
	  }
      })
}));
