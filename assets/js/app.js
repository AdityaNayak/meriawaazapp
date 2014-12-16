Parse.initialize('km3gtnQr78DlhMMWqMNCwDn4L1nR6zdBcMqzkUXt', 'BS9nk6ykTKiEabLX1CwDzy4FLT1UryRR6KsdRPJI');

function addList(){    
    ListItem = Parse.Object.extend("complaint");
    query = new Parse.Query(ListItem);
    query.include('deviceId');
    query.include('user');
    query.descending('createdAt');
    var adminTable=$('#admin-tb tbody');
    query.limit(20);
    query.find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) { 
            var object = results[i];            
            var userObjectId = object.get('deviceId').id;
            console.log('lol');
            if ( typeof object.get('photo') !== 'undefined'){
                adminTable.append( "<tr><td>"+object.createdAt+"</td><td>"+object.get('category')+"</td><td>"+object.get('content')+"</td><td>"+object.get('location').latitude+","+object.get('location').longitude+"</td><td><a href="+object.get('photo')._url+" target='_blank'>Image</a></td><td class='clktrg' id="+userObjectId+">View</td><td>"+object.get('googleId')+"</td></tr>");
                //console.log(object.get('deviceId'));
            }       
            else{
                adminTable.append( "<tr><td>"+object.createdAt+"</td><td>"+object.get('category')+"</td><td>"+object.get('content')+"</td><td>"+object.get('location').latitude+","+object.get('location').longitude+"</td><td></td><td class='clktrg' id="+userObjectId+">View</td><td>"+object.get('googleId')+"</td></tr>");
            }            
        }
      console.log('ho gaya');
      $('.clktrg').on("click", onclickuser);
    },
      error: function(error) {
        }
    });
    //$('.clktrg').on("click", onclickuser);
}

function onclickuser(){
    userList = Parse.Object.extend("user");
    var query2 = new Parse.Query(userList);
    var userObjectId = this.id;
    query2.get(userObjectId, {
        success: function (object) {
        if (object.get('googleId')){
            temp3= object.get('googleId');
            alert(temp3);
        }
        else if (object.get('facebookEmail')){
            temp3 = object.get('facebookEmail');
            alert(temp3);
            
        }
        
        else{
            console.log('empty');
        }
        },

        error: function(object, error) {

        }
    });
}

function initialize() {
        addList();
}