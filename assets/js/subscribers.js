var currentUser;
var neta;
var constituency;
var sTable=$('#subscribers-table tbody');

function newUser(u,p){
    var user = new Parse.User();
    user.set("username", u);
    user.set("password", u+"galaxy");
    user.signUp(null, {
          success: function(user) {
            alert("Success Finally!");
          },
          error: function(user, error) {
            alert("Error: " + error.code + "\n\nwhat is the error \n\n " + error.message);
          }
    });
}

function updateCounters(){
    
    var Citizens= Parse.Object.extend("Citizen");
    var Subscribers = Parse.Object.extend("Subscriber");
    var Subscribers2 = Parse.Object.extend("Subscriber");
    var Subscribers3 = Parse.Object.extend("Subscriber");
    var query1 = new Parse.Query(Citizens);
    var query2 = new Parse.Query(Subscribers);
    query2.equalTo("neta",neta);
    var query3 = new Parse.Query(Subscribers2);
    query3.notEqualTo("phone","");
    query3.equalTo("neta",neta);
    var query4 = new Parse.Query(Subscribers3);
    query4.equalTo("neta",neta);
    query4.equalTo("phone","");
    query4.notEqualTo("email","");
    

    query2.count({
      success: function(count2) {
        console.log(count2);
        var numAnim2 = new countUp("tot", 0, count2);
        numAnim2.start();
        query1.count({
              success: function(count1) {
                console.log(count1);
                var numAnim1 = new countUp("pop", 0, count2+count1+4487);
                numAnim1.start();
              },
              error: function(error) {

                alert("Error: " + error.code + " " + error.message);
              }
            });
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });

    query3.count({
      success: function(count3) {
        console.log(count3);
        var numAnim3 = new countUp("mob", 0, count3);
        numAnim3.start();
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });

    query4.count({
      success: function(count4) {
        console.log(count4);
        var numAnim4 = new countUp("ema", 0, count4);
        numAnim4.start();
        NProgress.done();
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
    
}

function populateSubscribers(){
    sTable.html("");
    var Subscribers = Parse.Object.extend("Subscriber");
    var query=new Parse.Query(Subscribers);
    var pointer= new Parse.Object("Neta");
    pointer.id=neta.id;
    query.equalTo("neta",pointer);
    query.include("puser");
    query.find({
        success: function(result){
            console.log(result.length);
            for(var i=0;i<result.length;i++){
                object=result[i];
                sTable.append( "<tr><td>"+object.get("name")+"</td><<td>"+object.get("age")+"</td><td>"+object.get("email")+"</td><td>"+object.get("phone")+"</td></tr>");
            }
            NProgress.done();

        },
        error: function(error){
            console.log("Error: "+error.message);
            NProgress.done();
        }
    });
}

function getStuff(){
    currentUser=CU;
    CU.fetch({
          success: function(results) {
                console.log("Size:"+results.length);
                object=CU;
                var p;
                var n;
                if(object.get("type")=="neta"){
                    var n=object.get("neta");
                    n.fetch({
                        success: function(results){
                            neta=n;
                            if(CU.get("username")!="admin"){
                                console.log(n.get("constituency"));
                                constituency=n.get("constituency");
                                constituency.fetch({
                                    success:function(results){
                                        updateCounters();
                                        populateSubscribers();
                                    },
                                    error:function(error){
                                        console.log("Error: "+error.message);
                                        NProgress.done();
                                    }
                                })
                                
                            }                                
                        },
                        error: function(error){
                            console.log("Error: "+error.message);
                            NProgress.done();
                        }
                    });
                }
                if(object.get("type")=="teamMember"){
                    var t=object.get("teamMember");
                    t.fetch({
                        success:function(results){
                            n=t.get("neta");
                            n.fetch({
                              success:function(results){
                                    neta=n;
                                    constituency=n.get("constituency");
                                    constituency.fetch({
                                        success:function(results){
                                            updateCounters();
                                            populateSubscribers();
                                        },
                                        error:function(error){
                                            console.log("Error: "+error.message);
                                            NProgress.done();
                                        }
                                    });
                                },
                                error:function(error){
                                    console.log("Error: "+error.message);
                                    NProgress.done();
                                }
                            });  
                        },
                        error: function(error){
                            console.log("Error: "+error.message);
                            NProgress.done();
                        }
                    });
                }
                
            },
          error: function(error) {
                console.log("Error: "+error.message);
                NProgress.done();
          }
    });
}


function initialize() {
    console.log("initialize");
    currentUser = CU;
    NProgress.start();
    console.log("NProgress Start");
    getStuff();
    
}

initialize();

