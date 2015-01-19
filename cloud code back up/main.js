Parse.Cloud.define("getConstituency",function(request,response){
        Parse.Cloud.useMasterKey();
        var ply = require('cloud/polygon.js');
        var gp=new Parse.GeoPoint({latitude: request.params.lat, longitude: request.params.lng});
        var pt={x:request.params.lat,y:request.params.lng};
        ListItem = Parse.Object.extend("Constituency");
        query = new Parse.Query(ListItem);
        query.limit(7);
        var nearByConstituencyNames = ""
        var nearByConstituencyObjectIds = ""
        query.near("center", gp);
        query.find({
              success: function(results) {
                    poly=[];
                    for(var i=0;i<results.length;i++){
                        nearByConstituencyNames += results[i].get("name");
                        nearByConstituencyObjectIds += results[i].id;
                        if(i!=results.length-1)
                        {
                            nearByConstituencyNames+=",";
                            nearByConstituencyObjectIds+=",";
                        }
                        var Coords=[];
                        var points=results[i].get("points");
                        for (var j = 0; j < points.length; j++) { 
                            Coords.push({x:points[j].latitude,y:points[j].longitude});
                        }
                        poly.push([Coords,results[i].get("name"),results[i].id]);                                           
                    }
                    var jsonObject = {
                             "name": "Error",
                             "id": "Error",
                             "nearByConstituencyNames": "Error",
                             "nearByConstituencyObjectIds": "Error"
                             };
                    for(var s=0;s<poly.length;s++){
                        if(ply.pointInPolygon(pt, poly[s][0], poly[s][1], true)==true){
                            jsonObject["name"] = poly[s][1];
                            jsonObject["id"] = poly[s][2];
                            /*jsonObject = {
                            "name": poly[s][1],
                            "id": poly[s][2]
                            };*/
                        }
                    }
                    jsonObject = {
                        "name": jsonObject["name"],
                        "id": jsonObject["id"],
                        "nearByConstituencyNames": nearByConstituencyNames,
                        "nearByConstituencyObjectIds": nearByConstituencyObjectIds
                    };
                    response.success(jsonObject);
                },
              error: function(error) {
                    var jsonObject = {
                             "name": "Error",
                             "id": "Error",
                             "nearByConstituencyNames": "Error",
                             "nearByConstituencyObjectIds": "Error"
                             };
                    response.error(jsonObject);
              }
        });
   
});
 
Parse.Cloud.define("getAllConstituencies",function(request,response){
        ListItem = Parse.Object.extend("Constituency");
        query = new Parse.Query(ListItem);
        var allConstituencyNames = ""
        var allConstituencyObjectIds = ""
        query.find({
              success: function(results) {
                    poly=[];
                    for(var i=0;i<results.length;i++){
                        allConstituencyNames += results[i].get("name");
                        allConstituencyObjectIds += results[i].id;
                        if(i!=results.length-1)
                        {
                            allConstituencyNames+=",";
                            allConstituencyObjectIds+=",";
                        }
                    }
                    var jsonObject = {
                        "allConstituencyNames": allConstituencyNames,
                        "allConstituencyObjectIds": allConstituencyObjectIds
                    };
                    response.success(jsonObject);
                },
              error: function(error) {
                    var jsonObject = {
                             "allConstituencyNames": "Error",
                             "allConstituencyObjectIds": "Error"
                             };
                    response.error(jsonObject);
              }
        }); 
});
  
Parse.Cloud.define("incrementReach", function(request, response) {
  Parse.Cloud.useMasterKey();
  var className = request.params.className;
  var ids = request.params.ids;
  var query = new Parse.Query(className);
  query.limit(1000);
  query.containedIn("objectId",ids);
  query.find({
  success: function(results) {
    var listSave = [];
    for(var i=0;i<results.length;i++)
    {
      var parseObject = results[i];
      parseObject.increment("reach");
      listSave.push(parseObject);
    }
    //saveAll starts below
    Parse.Object.saveAll(listSave,{
    success: function(list) {
      // All the objects were saved.
      response.success("saveAll done");
    },
    error: function(error) {
      // An error occurred while saving one of the objects.
      response.error("saveAll failed");
    },
  }); //saveAll ends
  },
 
  error: function(error) {
    // error is an instance of Parse.Error.
    response.error("overAll error");
  }
});
   
});
 
Parse.Cloud.define("changeNum", function(request, response) {
  Parse.Cloud.useMasterKey();
  if(request.user==undefined)
  {
    response.error("not allowed 0");
    return;
  }
  var objectId = request.params.objectId;
  var className = request.params.className;
  if(className!="Issue" && className!="Neta" && className!="Post" && className!="Question")
  {
    response.error("not allowed 1");
    return;
  }
  var field = request.params.field
  var amount = request.params.amount;
  if(amount!=1 && amount !=-1)
  {
    response.error("not allowed 2");
    return;
  }
  var query = new Parse.Query(className);
  query.get(objectId, {
    success: function(object) {
      object.increment(field,amount);
      object.save({
        success: function(results) {
          response.success("saved");
        },
 
        error: function(error) {
          response.error("error Saving");
        }
      });
    },
 
    error: function(object, error) {
    response.error("overall error");
    }
  });
});
 
Parse.Cloud.define("changeStatus", function(request, response) {
  Parse.Cloud.useMasterKey();
  var user = request.user;
  if(user.get("type")!="neta" && user.get("type")!="teamMember")
  {
    response.error("invalid user");
    return;
  }
 
  var status = request.params.status;
  var query = new Parse.Query("Issue");
  var objectId = request.params.objectId;
  query.get(objectId, {
    success: function(object) {
      object.set("status",status);
      if(status.indexOf("claim") > -1)
      {
        object.increment("numClaimers");
      }
      object.save({
        success: function(results) {
          if(status.indexOf("claim") > -1)
          {
            Parse.Cloud.run('changeNum', { className : 'Neta', objectId : user.id, field: 'numClaimers', amount : 1 }, {
              success: function(ratings) {
                response.success("saved2");
              },
              error: function(error) {
                response.error("error c");
              }
            });
          }
          else
          {
            response.success("saved");
          }
        },
        error: function(error) {
          response.error("error Saving");
        }
      });
    },
 
    error: function(object, error) {
      response.error("overall error");
    }
  });
});
 
Parse.Cloud.beforeSave("Issue", function(request, response) {
  if(request.object.id!=null)
  {
    response.success();
    return;  
  }
  query = new Parse.Query("Issue");
  query.addDescending("issueId");
  query.limit(2); // can use first, optimization later
  query.find({
    success: function(results) {
      //set issueId
      var issue = results[0];
      request.object.set("issueId",Number(issue.get("issueId"))+1);
      //initialize vars
      request.object.set("numClaimers",0);
      request.object.set("reach",1);
      request.object.set("numUpvotes",0);
      request.object.set("numUpdates",0);
      request.object.set("numFollowers",1);
      request.object.set("lastUpdated",new Date());
      //set acl
      var acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setPublicWriteAccess(false);
      request.object.setACL(acl);
      //set pUser
      var pUser = request.user.get("pUser");
      request.object.set("pUser",pUser);
      //save
      response.success();
    },
    error: function(error) {
      response.error("overAll error");
    }
  });  
});
 
Parse.Cloud.beforeSave("Update", function(request, response) {
  Parse.Cloud.useMasterKey();
  if(request.object.id!=null)
  {
    response.success();
    return;  
  }
  //update issue
  var issue = request.object.get("issue");
  issue.increment("numUpdates");
  issue.set("lastUpdated",new Date());
  issue.save({
    success: function(results) {
      //set acl
      var acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setPublicWriteAccess(false);
      request.object.setACL(acl);
      //set pUser
      var pUser = request.user.get("pUser");
      request.object.set("pUser",pUser);
      //save
      response.success();
    },
 
    error: function(error) {
      response.error("error Saving");
    }
  });
});
 
Parse.Cloud.beforeSave("Question", function(request, response) {
  if(request.object.id!=null)
  {
    response.success();
    return;  
  }
  if(request.object.get("openTo").indexOf("neta") > -1)
  {
    Parse.Cloud.useMasterKey();
  }
  //initialize vars
  request.object.set("reach",1);
  request.object.set("numUpvotes",0);
  request.object.set("numAnswers",0);
  request.object.set("numFollowers",1);
  request.object.set("lastUpdated",new Date());
  //set acl
  var acl = new Parse.ACL();
  acl.setPublicReadAccess(true);
  acl.setPublicWriteAccess(false);
  request.object.setACL(acl);
  //set pUser
  var pAsker = request.user.get("pUser");
  request.object.set("pAsker",pAsker);
  //update neta if openTo == neta
  if(request.object.get("openTo").indexOf("neta") > -1)
  {
    var neta = request.object.get("askedTo");
    neta.increment("numQsAskedTo");
    neta.save({
      success: function(results) {
        response.success();
    },
      error: function(error) {
        response.error("error Saving");
      }
    });
  }
  else
  {
    //save
    response.success();  
  }
   
});
 
Parse.Cloud.beforeSave("Answer", function(request, response) {
  Parse.Cloud.useMasterKey();
  if(request.object.id!=null)
  {
    response.success();
    return;  
  }
  //update question
  var question = request.object.get("question");
  question.increment("numAnswers");
  question.set("lastUpdated",new Date());
  question.save({
    success: function(results) {
      //set acl
      var acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setPublicWriteAccess(false);
      request.object.setACL(acl);
      //set pUser
      var pUser = request.user.get("pUser");
      request.object.set("pUser",pUser);
      //save
      response.success();
    },
 
    error: function(error) {
      response.error("error Saving");
    }
  });
});
 
Parse.Cloud.beforeSave("Post", function(request, response) {
  Parse.Cloud.useMasterKey();
  if(request.object.id!=null)
  {
    response.success();
    return;  
  }
  //set acl
  var acl = new Parse.ACL();
  acl.setPublicReadAccess(true);
  acl.setPublicWriteAccess(false);
  request.object.setACL(acl);
  //initialize vars
  request.object.set("numUpvotes",0);
  request.object.set("numComments",0);
  request.object.set("reach",0);
  request.object.set("lastUpdated",new Date());
  //increment neta posts
  var neta = request.object.get("neta");
  neta.increment("numPosts");
  neta.save({
    success: function(results) {
      //save
      response.success();
    },
 
    error: function(error) {
      //response.error("error Saving");
    }
  });
  //response.success();
});

 
Parse.Cloud.afterSave("Post", function(request) {
    Parse.Cloud.useMasterKey();
     var queryNeta = new Parse.Query("Neta");
                 queryNeta.include("user");
                 queryNeta.get(request.object.get("neta").id, {
                      success: function(neta) {
                        var querySubscribers = new Parse.Query("Subscriber");
                        var userSubscriberPointers = new Array();
                        var pushSubscribers = new Array();
                        querySubscribers.equalTo("neta",neta);
                        querySubscribers.notEqualTo("user",undefined);
                        querySubscribers.include("user");
                        querySubscribers.find({
                              success: function(subscribers) 
                              {
                               
                                    console.log(subscribers.length);
                                    for(var i = 0;i<subscribers.length;i++)
                                    {
                                    userSubscriberPointers.push(subscribers[i].get("user"));
                                    }
                                    var queryInstallation = new Parse.Query(Parse.Installation);
                                    queryInstallation.containedIn("user", userSubscriberPointers);
                                    queryInstallation.include("user");
                                    queryInstallation.find({
                                              success: function(installations) {
                                                for (var i =0;i<installations.length;i++)
                                                {
                                                        pushSubscribers.push(installations[i].get("user"));
                                                }
                                                console.log("push subscriber length"+pushSubscribers.length);
                                              },
 
                                              error: function(error) {
                                                 
                                              }
                                            });
                                
                                    var message = "There is a new post by " + neta.get("user").get("name");
                                                                              
                                            Parse.Push.send({
                                              where: queryInstallation,
                                              data: {
                                                type: "post",
                                                objectID: request.object.id,
                                                message: message
                                              }
                                            }, {
                                              success: function() {
                                                console.log("Push sent");
                                              },
                                              error: function(error) {
                                                console.log("Push not successful");
                                              }
                                            }); 
                                     
                              },
 
                              error: function(error) {
                                // error is an instance of Parse.Error.
                              }
                            });
                             
                             
                        var querySubscribers = new Parse.Query("Subscriber");
                        var smsSubscribers = new Array();
                        querySubscribers.equalTo("neta",neta);
                        //querySubscribers.notEqualTo("phone",undefined);
                        querySubscribers.include("user");
                        querySubscribers.find({
                              success: function(subscribers) 
                              {
                              console.log("neta id "+neta.id);
                              console.log("sms subscribers raw list "+subscribers.length);
                                    for(var i = 0;i<subscribers.length;i++)
                                    {
                                        if((subscribers[i].get("user")!=undefined) && (pushSubscribers.indexOf(subscribers[i].get("user"))==-1))
                                           {
                                             
                                                smsSubscribers.push(subscribers[i]);
                                             
                                            }
                                        else if(subscribers[i].get("user")==undefined)
                                        {
                                                smsSubscribers.push(subscribers[i]);
                                        }
                                     
                                    }
                                    console.log(smsSubscribers[0].get("firstName"));
                                    console.log("smsSubscribers length"+smsSubscribers.length);
                                    for(var i =0;i<smsSubscribers.length;i++)
                                    {
                                    console.log(smsSubscribers[i].get("firstName"));
                                    var message = "There is a new post by " + neta.get("user").get("name");
                                    console.log(message);
                                    var phone = smsSubscribers[i].get("phone").toString();
                                    console.log(phone);
                                    var link = "http://promo.springedge.com/api/web2sms.php?workingkey=Aff3d7528c6ebf6ec2fb3ffeb98f08232&sender=BULKSMS&to="+phone+"&message="+message;
                                     
                                    console.log(link);
                                            Parse.Cloud.httpRequest({
                                                      url: encodeURI(link),
                                                      success: function(httpResponse) {
                                                        console.log(httpResponse.text);
                                                      },
                                                      error: function(httpResponse) {
                                                        console.log('Request failed with response code ' + httpResponse.status);
                                                      }
                                                    });     
                                     
                                    }
 
                                     
                                     
                                     
                                     
                              },
 
                              error: function(error) {
                                // error is an instance of Parse.Error.
                              }
                            });
                       
                       
                       
                        var querySubscribers = new Parse.Query("Subscriber");
                        var emailSubscribers = new Array();
                        querySubscribers.equalTo("neta",neta);
                        querySubscribers.notEqualTo("email",undefined);
                        querySubscribers.include("user");
                        querySubscribers.find({
                              success: function(subscribers) 
                              {
                                    for(var i = 0;i<subscribers.length;i++)
                                    {
                                        if((subscribers[i].get("user")!=undefined) && (pushSubscribers.indexOf(subscribers[i].get("user"))==-1)  && (smsSubscribers.indexOf(subscribers[i])==-1))
                                           {
                                             
                                                emailSubscribers.push(subscribers[i]);
                                             
                                            }
                                        else if((subscribers[i].get("user")==undefined) && (smsSubscribers.indexOf(subscribers[i])==-1))
                                        {
                                                emailSubscribers.push(subscribers[i]);
                                        }
                                     
                                    }
                                     
                                    for(var j =0;j<emailSubscribers.length;j++)
                                    {
                                            console.log(emailSubscribers.get("email")); 
                                     
                                    }
 
                                     
                                     
                                     
                                     
                              },
 
                              error: function(error) {
                                // error is an instance of Parse.Error.
                              }
                            });
                       
                       
                       
                       
                        var queryFollowers = new Parse.Query("Follower");
                        queryFollowers.equalTo("neta", neta);
                        queryFollowers.equalTo("type", "like");
                        queryFollowers.include("user");
                        queryFollowers.find({
                                      success: function(followers) {
                                            var users = new Array();
                                            var pushFollowers = new Array();
                                            console.log(followers.length);
                                            for ( var i=0;i<followers.length;i++)
                                            {
                                                    if(pushSubscribers.indexOf(followers[i].get("user"))==-1)
                                                    {
                                                        pushFollowers.push(followers[i].get("user"));
                                                    }
                                                     
                                            }
                                             
                                            var message = "There is a comment on a post by " + neta.get("user").get("name");
                                            var queryInstallation = new Parse.Query(Parse.Installation);
                                            queryInstallation.containedIn("user", pushFollowers );
                                                                                          
                                            Parse.Push.send({
                                              where: queryInstallation,
                                              data: {
                                                type: "post",
                                                objectID: request.object.id,
                                                message: message
                                              }
                                            }, {
                                              success: function() {
                                                console.log("Push sent");
                                              },
                                              error: function(error) {
                                                console.log("Push not successful");
                                              }
                                            }); 
                                                                     
                                      },
 
                                      error: function(error) {
                                        // error is an instance of Parse.Error.
                                      }
                                    });
                      },
 
                      error: function(object, error) {
                        // error is an instance of Parse.Error.
                      }
            });
      
     
     
  });

 
Parse.Cloud.beforeSave("PostComment", function(request, response) {
  Parse.Cloud.useMasterKey();
  if(request.object.id!=null)
  {
    response.success();
    return;  
  }
  //update post
  var post = request.object.get("post");
  post.increment("numComments");
  post.set("lastUpdated",new Date());
  post.save({
    success: function(results) {
      //set acl
      var acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setPublicWriteAccess(false);
      request.object.setACL(acl);
      //set pUser
      var pUser = request.user.get("pUser");
      request.object.set("pUser",pUser);
      if(request.user.get("type").indexOf("neta") > -1)
      {
        var neta = request.user.get("neta");
        neta.increment("numComments");
        neta.save({
          success: function(results) {
            response.success();
          },
 
          error: function(error) {
            //response.error("error Saving");
          }
        });
      }
      else
      {
        //save
        response.success();  
      }
    },
 
    error: function(error) {
      //response.error("error Saving");
    }
  });
});
 
Parse.Cloud.beforeSave("Follower", function(request, response) {
  if(request.object.id!=null)
  {
    response.success();
    return;  
  }
  //set acl
  var acl = new Parse.ACL();
  acl.setPublicReadAccess(true);
  acl.setPublicWriteAccess(false);
  acl.setWriteAccess(request.user,true);
  request.object.setACL(acl);
  //save
  response.success();
});
 
Parse.Cloud.afterSave("_User", function(request) {
  var user = request.user;
  if(user.get("pUser")!=undefined)
  {
    return;
  }
  //new pUser
  var PUser = Parse.Object.extend("PUser");
  var pUser = new PUser();
  //set username
  var username = user.get("username");
  pUser.set("username",username);
  if(username.indexOf("@") > -1)
  {
    var arr = username.split("@");
    pUser.set("username",arr[0]);
  }
  //set acl
  var acl = new Parse.ACL();
  acl.setPublicReadAccess(true);
  acl.setPublicWriteAccess(false);
  acl.setWriteAccess(request.user,true);
  pUser.setACL(acl);
  //set user
  pUser.set("user",user);
  //save pUser
  pUser.save({
    success: function(results) {
      //set pUser
      user.set("pUser",pUser);
      //set acl
      user.setACL(new Parse.ACL(user));
      //save
      user.save({
        success: function(results) {    
        },
        error: function(error) {
        }
      });
    },
    error: function(error) {
    }
  });
});
 
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});