var currentUser;

//Query User -> Neta Table
var netaName;

//Query User -> Neta  Table
var netaAge;

//Query User -> Neta  Table
var party;

//Query User -> Neta  Table
var constituency;

//Query User -> Neta Table
var state;

//Query User -> Neta Table
var history=[];

//Query User -> Neta Table
var education;

//Query User -> Neta Table
var assets;

//Query User -> Neta Table
var liabilities;

//Query User -> Neta Table
var criminalCases;

//Query Follower Table
var followers;

//Query PostsUpdate Table
var reach;

//Query PostsUpdate Table
var supporters;

//Query PostsUpdate Table
var skeptics;

//Query PostsUpdate Table
var comments;

//Query Questions Table
var questionsAsked;

//Query Answers Table
var questionsAnswered;

//Query TeamMember Table
var teamSize;

//Query Update Table
var issuesClaimed;

//Query Update Table
var issuesClosed;

//Query Update Table
var issuesValidated;



function queryUserTable(){
    console.log('QueryUserTable');
    ListItem = Parse.Object.extend("User");
    query = new Parse.Query(ListItem);
    query.descending('createdAt');
    query.find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) { 
            var object = results[i];
        }
        queryUpdateTable();
      },
      error: function(error) {
      }
    });
}

function queryUpdateTable(){
    console.log('QueryUpdateTable');
    ListItem = Parse.Object.extend("Update");
    query = new Parse.Query(ListItem);
    query.descending('createdAt');
    query.find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) { 
            var object = results[i];
        }
        queryPostsUpdateTable();
      },
      error: function(error) {
      }
    });
}

function queryPostsUpdateTable(){
    console.log('QueryPostsUpdateTable');
    ListItem = Parse.Object.extend("PostsUpdate");
    query = new Parse.Query(ListItem);
    query.descending('createdAt');
    query.find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) { 
            var object = results[i];
        }
        queryFollowerTable();
      },
      error: function(error) {
      }
    });
}

function queryFollowerTable(){
    console.log('QueryFollowerTable');
    ListItem = Parse.Object.extend("Follower");
    query = new Parse.Query(ListItem);
    query.descending('createdAt');
    query.find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) { 
            var object = results[i];
        }
        queryQuestionTable();
      },
      error: function(error) {
      }
    });
}

function queryQuestionTable(){
    console.log('QueryQuestionTable');
    ListItem = Parse.Object.extend("Question");
    query = new Parse.Query(ListItem);
    query.descending('createdAt');
    query.find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) { 
            var object = results[i];
        }
        queryAnswerTable();
      },
      error: function(error) {
      }
    });
}

function queryAnswerTable(){
    console.log('QueryAnswerTable');
    ListItem = Parse.Object.extend("Answer");
    query = new Parse.Query(ListItem);
    query.descending('createdAt');
    query.find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) { 
            var object = results[i];
        }
        queryTeamMemberTable();
      },
      error: function(error) {
      }
    });
}

function queryTeamMemberTable(){
    console.log('QueryTeamMemberTable');
    ListItem = Parse.Object.extend("TeamMember");
    query = new Parse.Query(ListItem);
    query.descending('createdAt');
    query.find({
      success: function(results) {
        for (var i = 0; i < results.length; i++) { 
            var object = results[i];
        }
        displayData();
      },
      error: function(error) {
      }
    });
}

function displayData(){
    console.log('QueryUpdateTable');
    NProgress.done();
}

function initialize() {
    console.log("initialize");
    currentUser = CU;
    NProgress.start();
    console.log("NProgress Start");
    queryUserTable();
}

initialize();
