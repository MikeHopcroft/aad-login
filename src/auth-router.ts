// var express = require('express');
import * as express from 'express';
// var passport = require('passport');
import * as passport from 'passport';

export const authRouter = express.Router();

/* GET auth callback. */
authRouter.get('/signin',
    function (req, res, next) {
        console.log('/signin before passport.authenticate');
        passport.authenticate('azuread-openidconnect',
            {
                // response: res,
                prompt: 'login',
                failureRedirect: 'failure',
                failureFlash: true,
                successRedirect: 'success'
            }
        )(req, res, next);
    }
);

/* GET auth callback. */
authRouter.get('/success',
    function (req, res, next) {
        console.log('/success');
        res.status(200);
        res.json({ message: 'succeeded', user: (req as any).session.passport.user });
    }
);

/* GET auth callback. */
authRouter.get('/failure',
function (req, res, next) {
    console.log('/failed');
    res.status(500);
    res.json({ message: 'failed' });
}
);

// router.post('/callback',
//   function(req, res, next) {
//     passport.authenticate('azuread-openidconnect',
//       {
//         response: res,
//         failureRedirect: '/',
//         failureFlash: true
//       }
//     )(req,res,next);
//   },
//   function(req, res) {
//     // TEMPORARY!
//     // Flash the access token for testing purposes
//     req.flash('error_msg', {message: 'Access token', debug: req.user.accessToken});
//     res.redirect('/');
//   }
// );
authRouter.post('/callback',
    function (req, res, next) {
        console.log('/callback before passport.authenticate');
        passport.authenticate(
            'azuread-openidconnect',
            {
                response: res,
                failureRedirect: 'failure',
                failureFlash: true,
                successRedirect: 'success'
            } as any
        )(req, res, next);
    }
);

// router.get('/signout',
//   function(req, res) {
//     req.session.destroy(function(err) {
//       req.logout();
//       res.redirect('/');
//     });
//   }
// );

// module.exports = authRouter;
