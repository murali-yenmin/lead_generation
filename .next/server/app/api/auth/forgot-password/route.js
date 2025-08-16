(()=>{var e={};e.id=7556,e.ids=[7556],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},12518:e=>{"use strict";e.exports=require("mongodb")},21820:e=>{"use strict";e.exports=require("os")},27910:e=>{"use strict";e.exports=require("stream")},28354:e=>{"use strict";e.exports=require("util")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},34631:e=>{"use strict";e.exports=require("tls")},34802:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>w,routeModule:()=>g,serverHooks:()=>h,workAsyncStorage:()=>m,workUnitAsyncStorage:()=>x});var s={};r.r(s),r.d(s,{POST:()=>f});var o=r(96559),i=r(48088),a=r(37719),n=r(32190),d=r(75745),l=r(55511),c=r.n(l),p=r(49526);async function u({to:e,url:t}){try{let r=p.createTransport({service:"gmail",auth:{user:process.env.EMAIL_ADDRESS,pass:process.env.EMAIL_PASS}}),s={from:`"Auto Post" <${process.env.EMAIL_ADDRESS}>`,to:e,subject:"Reset Your Password - AutoPost",html:`
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background-color: #1d4ed8; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🔐 AutoPost</h1>
            </div>
            
            <!-- Body -->
            <div style="padding: 30px; color: #333333;">
              <p style="font-size: 16px;">Hello,</p>
              <p style="font-size: 16px; line-height: 1.6;">
                We received a request to reset your password for your <strong>AutoPost</strong> account.  
                Click the button below to set up a new password. This link is valid for <strong>1 hour</strong>.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${t}" style="background-color: #1d4ed8; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              
              <p style="font-size: 14px; color: #555;">
                If the button above doesn’t work, copy and paste this link into your browser:
              </p>
              <p style="font-size: 14px; word-break: break-word; color: #1d4ed8;">
                ${t}
              </p>
              
              <p style="font-size: 14px; color: #999;">
                If you did not request this, you can safely ignore this email.  
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>\xa9 ${new Date().getFullYear()} AutoPost. All rights reserved.</p>
              <p>
                <a href="#" style="color: #1d4ed8; text-decoration: none;">Privacy Policy</a> | 
                <a href="#" style="color: #1d4ed8; text-decoration: none;">Support</a>
              </p>
            </div>
          </div>
        </div>
      `};await r.sendMail(s),console.log(`✅ Password reset email sent to ${e}`)}catch(t){throw console.error(`❌ Failed to send password reset email to ${e}:`,t),Error("Email sending failed")}}async function f(e){try{let{email:t}=await e.json();if(!t)return n.NextResponse.json({message:"Email address is required."},{status:400});let r=(await d.A).db(process.env.MONGODB_DB).collection("users"),s=await r.findOne({email:t});if(s){let e=c().randomBytes(32).toString("hex"),o=c().createHash("sha256").update(e).digest("hex"),i=new Date(Date.now()+36e5);await r.updateOne({_id:s._id},{$set:{passwordResetToken:o,passwordResetExpires:i}});let a=`http://localhost:3000/auth/reset-password?token=${e}`;await u({to:t,url:a})}return n.NextResponse.json({message:"If an account with that email exists, a password reset link has been sent."},{status:200})}catch(e){return console.error("Forgot Password API error:",e),n.NextResponse.json({message:"Internal Server Error"},{status:500})}}let g=new o.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/auth/forgot-password/route",pathname:"/api/auth/forgot-password",filename:"route",bundlePath:"app/api/auth/forgot-password/route"},resolvedPagePath:"D:\\murali\\lead_generation\\src\\app\\api\\auth\\forgot-password\\route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:m,workUnitAsyncStorage:x,serverHooks:h}=g;function w(){return(0,a.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:x})}},37366:e=>{"use strict";e.exports=require("dns")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:e=>{"use strict";e.exports=require("zlib")},75745:(e,t,r)=>{"use strict";let s;r.d(t,{A:()=>l});var o=r(12518),i=r(85665),a=r.n(i);if(!process.env.MONGODB_URI)throw Error("Please add your Mongo URI to .env");let n=process.env.MONGODB_URI;s=new o.MongoClient(n,{}).connect();let d=["/dashboard","/socialmedia","/email","/google-ads","/users","/settings","/clients"];(async function(){try{let e=await s,t=process.env.MONGODB_DB;if(!t)throw Error("Please define the MONGODB_DB environment variable in .env");let r=e.db(t),i=r.collection("roles"),n=r.collection("users"),l=r.collection("teams"),c=r.collection("organizations");await i.countDocuments()===0&&(await i.insertMany([{name:"Super Admin",description:"Full platform control",level:100,permissions:d},{name:"Admin",description:"Organization-level admin",level:90,permissions:d},{name:"Organization Owner",description:"Manages own org & billing",level:80,permissions:["/dashboard","/socialmedia","/google-ads"]},{name:"Team Manager",description:"Manages a specific team",level:70,permissions:["/dashboard","/socialmedia"]},{name:"Marketer",description:"Social media & campaigns",level:60,permissions:["/socialmedia","/google-ads"]},{name:"Staff",description:"Basic access",level:50,permissions:["/dashboard"]}]),console.log("✅ Default roles seeded."));let p=await i.findOne({name:"Super Admin"});if(!p)throw Error("Super Admin role not found in roles collection.");if(!await n.findOne({email:"yenmin@gmail.com"})){let e=await a().hash("Yenmin@1234#",10);await n.insertOne({_id:new o.ObjectId,name:"Super Admin",email:"yenmin@gmail.com",password:e,roleId:p._id,organizationId:new o.ObjectId("60f6e1b9b3b3b3b3b3b3b3b3"),teamId:null,status:"active",createdAt:new Date,updatedAt:new Date}),console.log("✅ Default Super Admin user created: yenmin@gmail.com")}await c.updateMany({status:{$exists:!1}},{$set:{status:"active"}}),await l.createIndex({name:1,organizationId:1},{unique:!0}),console.log("✅ Team name index created.")}catch(e){if(85===e.code)console.log("Index already exists, skipping creation.");else if(86===e.code)console.log("Index with different options exists, skipping creation.");else throw console.error("❌ Error during DB initialization:",e),e}})().catch(e=>{console.error("DB Initialization failed. The application may not function correctly."),process.exit(1)});let l=s},78335:()=>{},79551:e=>{"use strict";e.exports=require("url")},79646:e=>{"use strict";e.exports=require("child_process")},81630:e=>{"use strict";e.exports=require("http")},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")},96487:()=>{}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[4447,580,5665,9526],()=>r(34802));module.exports=s})();