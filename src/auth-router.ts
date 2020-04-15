import * as express from 'express';
import * as passport from 'passport';

// TODO: wrap in createAuthRouter() function.
export function createAuthRouter() {
    const authRouter = express.Router();

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

    authRouter.get('/success',
        function (req, res, next) {
            console.log('/success');
            res.status(200);
            res.json({ message: 'succeeded', user: (req as any).session.passport.user });
        }
    );

    authRouter.get('/failure',
        function (req, res, next) {
            console.log('/failed');
            res.status(500);
            res.json({ message: 'failed' });
        }
    );

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

    return authRouter;
}
