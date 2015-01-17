var currentUser;
var neta;
var constituency;
var sTable=$('#subscribers-table tbody');

function updateCounters(){
    
    var Citizens= Parse.Object.extend("Citizen");
    var Subscribers = Parse.Object.extend("Subscriber");
    var Subscribers2 = Parse.Object.extend("Subscriber");
    var Subscribers3 = Parse.Object.extend("Subscriber");
    var query1 = new Parse.Query(Citizens);
    query1.equalTo("constituency",constituency);
    var query2 = new Parse.Query(Subscribers);
    var query3 = new Parse.Query(Subscribers2);
    query3.notEqualTo("phone",undefined);
    var query4 = new Parse.Query(Subscribers3);
    query4.equalTo("phone",undefined);
    query4.notEqualTo("email",undefined);
    query1.count({
      success: function(count1) {
        console.log(count1);
        var numAnim1 = new countUp("pop", 0, count1);
        numAnim1.start();
      },
      error: function(error) {

        alert("Error: " + error.code + " " + error.message);
      }
    });

    query2.count({
      success: function(count2) {
        console.log(count2);
        var numAnim2 = new countUp("tot", 0, count2);
        numAnim2.start();
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
    query.include("user");
    query.find({
        success: function(result){
            console.log(result.length);
            for(var i=0;i<result.length;i++){
                object=result[i];
                sTable.append( "<tr><td>"+object.get("firstName")+"</td><td>"+object.get("firstName")+"</td><td>"+object.get("age")+"</td><td>"+object.get("email")+"</td><td>"+object.get("phone")+"</td></tr>");
            }
            NProgress.done();

        },
        error: function(error){
            
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
                                        
                                    }
                                })
                                
                            }                                
                        },
                        error: function(results){
                            
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
                                            
                                        }
                                    });
                                },
                                error:function(error){
                                    
                                }
                            });  
                        },
                        error: function(error){
                            
                        }
                    });
                }
                
            },
          error: function(error) {
                console.log("Error:"+error.message);
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
