/* the /login endpoint isn't responsible for authenticating the user, 
as that's already been done by Firebase on the client side. 

Its role can be repurposed for additional server-side login logic. 

If your application has logic that must occur on the server during the login process, 
this is where it would now take place. Any sensitive actions performed in the login 
route should be protected by the checkFirebaseToken middleware to ensure that 
only authenticated requests are processed.*/
