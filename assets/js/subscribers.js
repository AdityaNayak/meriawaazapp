var currentUser;
var neta;
var constituency;
var sTable=$('#subscribers-table tbody');
var tobeuploaded=0;
var currentuploaded=0;
var smallarrays=[]; 
var dirty=0;
var skip=0;
var totalpages=0;

function deleterecords(n){
    ListItem = Parse.Object.extend("Subscriber");
    query = new Parse.Query(ListItem);
    var pointer = new Parse.Object("Neta");
    pointer.id = n;
    query.equalTo("neta", pointer);
    query.limit(1000);
    query.find({
      success: function(obj){
        Parse.Object.destroyAll(obj, {
              success: function(objs) {                     
                  console.log("destroyAll done");
              },
              error: function(error) { 
                  console.log("Error: "+error.message);
              }
          });
        console.log("success1");
      },
      error: function(error){
        console.log("Error: "+error.message);
      }
    });
}


function selfUpload(){
  if(dirty==1){
    console.log("Deleting Unsuccesful Uploads!");
    Parse.Cloud.run("deleteCSV", {ro: smallarrays[currentuploaded], ne: neta.id},{
      success:function(results){
        NProgress.set(currentuploaded/tobeuploaded);
        var numAnim1 = new countUp("per", 0, (currentuploaded/tobeuploaded)*100);
        numAnim1.start();
        console.log("Next Batch!");
        dirty=0;
        setTimeout('selfUpload()',10000);
      },
      error:function(error){
            console.log(error);
            if(error.message.indexOf("exceed") !=-1){
              console.log("Will try after "+61+" seconds");
              dirty=1;
              setTimeout('selfUpload()',(parseInt(61*1000)));
            }
            else{
              updateCounters();
              populateSubscribers();
              pagination();
              NProgress.done();
              $('#progress').delay(400).fadeOut(300);
            }
      }
    });
  }
  else{
      Parse.Cloud.run("uploadCSV", {ro: smallarrays[currentuploaded], ne: neta.id},{
      success:function(results){
        
        if(currentuploaded==tobeuploaded-1){
          console.log("Done!");
          updateCounters();
          populateSubscribers();
          pagination();
          console.log(results);
          NProgress.done();
          tobeuploaded=0;
          currentuploaded=0;
          $('#progress').delay(400).fadeOut(300);
        }
        else{
            currentuploaded=currentuploaded+1;
            NProgress.set(currentuploaded/tobeuploaded);
            var numAnim1 = new countUp("per", 0, (currentuploaded/tobeuploaded)*100);
            numAnim1.start();
            console.log("Next Batch!");
            
            setTimeout('selfUpload()',10000);
          
          
        }
      },
      error:function(error){
        console.log(error);
        if(error.message.indexOf("exceed") !=-1){
          console.log("Will try after "+61+" seconds");
          dirty=1;
          setTimeout('selfUpload()',(parseInt(61*1000)));
        }
        else{
          updateCounters();
          populateSubscribers();
          pagination();
          NProgress.done();
          $('#progress').delay(400).fadeOut(300);
        }
        
      }
    });
  }

}  
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

function changePage(s){
  skip=parseInt(s)*1000;
  populateSubscribers();
}

function setcurrentpage(s){
  for(var i=0;i<totalpages;i++){
    if(i==parseInt(s)){
      $("#page-"+i).closest("li").addClass('current');
    }
    else{
      $("#page-"+i).closest("li").removeClass('current');
    }
  }
}

function pagination(){
    $('#pages').html("");
    var Subscribers = Parse.Object.extend("Subscriber");
    
    var query = new Parse.Query(Subscribers);
    
    query.equalTo("neta",neta);
    query.count({
      success: function(count2) {
        console.log(count2);
        if(count2%1000==0){
          var numpages=Math.floor(count2/1000);
          totalpages=numpages;
        }else{
          var numpages=Math.floor(count2/1000)+1;
          totalpages=numpages;
        }
        if(numpages>10){
          numpages=10;
        }
        for(var i=0;i<numpages;i++){
          $('#pages').append("<li ><a id='page-"+i+"'>"+(i+1).toString()+"</a></li>");
          $('#page-'+i).off();
          $('#page-'+i).click(function(event){
            event.preventDefault();
                      NProgress.start();
                      console.log(event.target.id.toString().split('-')[1]);
                      changePage(event.target.id.toString().split('-')[1]);
                      setcurrentpage(event.target.id.toString().split('-')[1]);
                });
        }
        if(numpages!=0){
          $("#page-0").closest("li").addClass('current');
        }
        
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
    query.skip(skip);
    query.limit(1000);
    query.ascending("createdAt");
    query.find({
        success: function(result){
            console.log(result.length);
            console.log(skip);
            for(var i=0;i<result.length;i++){
                object=result[i];
                sTable.append( "<tr><td>"+object.get("name")+"</td><td>"+object.get("phone")+"</td><td>"+object.get("email")+"</td><td>"+object.get("age")+"</td></tr>");
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
                                        pagination();
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

