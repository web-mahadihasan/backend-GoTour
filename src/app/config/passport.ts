import passport from "passport";
import { Strategy as GoogleStrategy, type Profile, type VerifyCallback } from "passport-google-oauth20";
import config from "./environment";
import User from "@/app/modules/user/user.model";
import { Strategy as LocalStrategy} from "passport-local";


passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
    async (username, password, done) => {
       try {
            const isUserExist = await User.findOne({email: username})
            
            if(!isUserExist) {
                return done(null, false, {message: "User not found"})
            }

            const googleAuthenticated = isUserExist?.authProviders?.some((p) => p.provider === 'google')

            if (googleAuthenticated && !isUserExist.password) return done(null, false, {message: "You are google authenticated user! Please login with google. You can set password after google login"})

            const isPasswordValid = isUserExist.comparePassword(password)

            if (!isPasswordValid) return done(null, false, {message: "Invalid credentials"})

            return done(null, isUserExist as unknown as Express.User)

       } catch (error) {
        done(error)
       }
    }
    )
)

passport.use(
    // Create Google Strategy class
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.GOOGLE_CALLBACK_URL,
        }, async (
            _accessToken: string, 
            _refreshToken: string, 
            profile: Profile, 
            done: VerifyCallback
        ) => {
            try {
                // destructure email
                const email = profile.emails?.[0].value

                // If email not exit then call done() with error
                if (!email) {
                    done(null, false, {message: "No email found"})
                }

                // find user from DB
                let user = await User.findOne({email})
                
                // if user not found then create new user
                if(!user) {
                    user = await User.create({
                        email: profile.emails?.[0].value,
                        firstName: profile.name?.givenName,
                        lastName: profile.name?.familyName,
                        role: "user",
                        picture: profile.photos?.[0].value,
                        isVerified: true,
                        authProviders: [
                            {
                                provider: "google",
                                providerId: profile.id,
                            }
                        ]
                    })
                }
                
                return done (null, user as unknown as Express.User)

            } catch (error) {
                return done(error, false)
            }
        })
)

// user serialized
passport.serializeUser((user: Express.User, done: (err: Error | null, id: string) => void) => {
    done(null, user._id)
})

//User deserialized
passport.deserializeUser(async (id: string, done: (err: Error | null, user: Express.User | null) => void) => {
    try {
        const user = await User.findById(id)
        done(null, user as unknown as Express.User)
    } catch (error) {
        done(error as Error, null)
    }
})