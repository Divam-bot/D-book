App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (typeof web3 !== 'undefined') {
      console.log("undef no")
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(window.web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("socialBlocks.json", function(socialblock) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.socialBlocks = TruffleContract(socialblock);
      // Connect provider to interact with contract
      App.contracts.socialBlocks.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var socialBlocksInstance;
    console.log("checking eth.account array")


    web3.eth.defaultAccount = web3.eth.accounts[0]
    console.log(web3.eth.defaultAccount)
    //personal.unlockAccount(web3.eth.defaultAccount)

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        console.log("with coinbase")
        console.log(account)

        web3.eth.getBalance(account, function(error, result) {

          if (error) {
            console.log(error)
          } else {
            console.log("account balance");
            result1 = result.toString().substring(1, 3);
            result2 = result.toString().substring(3, 6);
            resultend = result1 + "." + result2;
            console.log(resultend)
            $("#balance").html(resultend);
          }
        });

        $("#accountAddress").html(account);
        App.contracts.socialBlocks.deployed().then(function(instance) {
          socialBlocksInstance = instance;
          socialBlocksInstance.users(account).then(function(user) {
            var useraddress = user[0];
            var userprofileimg = user[1];
            var userlikecnt = user[2];
            var userrep = user[5];

            $("#cornerprofileimg").attr("src", userprofileimg);

            // left side bar img reputaion and likecnt
            $(".card-img-cir").attr("src", userprofileimg);
            $("#displaylike").html(userlikecnt.toNumber());
            $("#displayrep").html(userrep.toNumber());

            // center add posts
            $("#addpostprofileimg").attr("src", userprofileimg);
            $("#addpostprofilename").html(useraddress);

          });
        });
      } else {
        console.log(err)
      }
    });

    web3.version.getNetwork(function(err, res) {
      console.log(res)
    });


    /*App.account = "0xC5e7a73316F8DAB681983E699e9CC1cDCdB7f653";
    $("#accountAddress").html("Your Account: " + App.account);*/

    //console.log(App.contracts.Todolist.deployed().then(function(a){todolist=a;a.taskcount();}))
    console.log(window.web3.currentProvider)

    console.log("flag1");

    App.contracts.socialBlocks.deployed().then(function(instance) {
      console.log("flag2");
      socialBlocksInstance = instance;

      // setting up loader
      var loader = $("#loader");
      var content = $("#content");

      loader.show();
      content.hide();

      return socialBlocksInstance.postcount();
    }).then(function(postcount) {

      //var $taskbox = $('.taskTemplate')
      console.log("this is value of postcount");
      console.log(postcount);

      for (var i = 1; i <= postcount; i++) {
        socialBlocksInstance.posts(i).then(function(post) {
          var id = post[0];
          var postcontent = post[1];
          var postimg = post[2];
          var postlikes = post[3];
          var postdislikes = post[4];
          var postreports = post[5];
          var ispostreported = post[6];
          var postowner = post[7];

          socialBlocksInstance.users(postowner).then(function(user) {

            var useraddress = user[0];
            var userprofileimg = user[1];
            var userlikecnt = user[2];
            var userrep = user[5];

            // left side bar



            // center add posts


            //posts itself
            if (!ispostreported) {
              var item =
                '<div class="post-container" data-id="' +
                id +
                '"> <div class="post-row"> <div class="user-profile"> <img src="' +
                userprofileimg +
                '" alt=""> <div> <p>' +
                postowner +
                '</p> <span>June 24 2021, 13:40:38pm</span> </div> </div> </div> <p class="post-text">' +
                postcontent +
                '<p> <img src="' +
                postimg +
                '" class="post-img" alt=""> <div class="post-row"> <div class="activity-icon"> <div> <button class="likebtn"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR73easIaEFFA2qSgS_1G8wdoLh3C8GKviB7g&usqp=CAU" alt=""></button>' +
                postlikes +
                '</div> <div> <button class="dislikebtn"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz7FB3bvG4dQAayl85GSImFIk4JXQENosN3g&usqp=CAU" alt=""></button>' +
                postdislikes +
                '</div> <div class="post-profile-icon"> <button type="button" class="btn btn-outline-danger btn-sm" id="reportbtn">report !</button> </div> </div> </div> </div>';

              // appending each post after last element of maincontent portion
              $(".main-content").append(item);
            }

          });



        });
      }

      $("#loader").hide();
      $("#content").show();

    }).catch(function(error) {
      console.warn(error);
    });
  },

  addPost: async () => {
    var p_content = $("#postcontent").val();
    var p_imgsrc = $("#postimagesrc").val();
    console.log("logging added task with content")
    console.log(p_content)
    App.contracts.socialBlocks.deployed().then(function(instance) {
      return instance.addPost(p_content, p_imgsrc)
    }).then(function(result) {
      // wait
      window.location.reload();
    }).catch(function(err) {
      console.log(err);
    });

  },

  togglecompleted: async (e) => {
    var task_id = e.target.name
    console.log("logging toggles taskid")
    console.log(task_id)
    App.contracts.Todolist.deployed().then(function(instance) {
      return instance.togglecompleted(task_id)
    }).then(function(result) {
      // wait
      window.location.reload();
    }).catch(function(err) {
      console.log(err);
    });

  },
};

$("#postsubmit").on("click", function() {
  App.addPost();
});

// for like button
console.log("just before like btn");

$(".main-content").on("click", 'button[class="likebtn"]', function() {
  console.log("inside like btn");
  var pc = $(this)
    .parent()
    .parent()
    .parent()
    .parent();

  var post_id = pc.data().id;
  console.log("logging likes postid")
  console.log(post_id)
  App.contracts.socialBlocks.deployed().then(function(instance) {
    return instance.onLike(post_id)
  }).then(function(result) {
    // wait
    window.location.reload();
  }).catch(function(err) {
    console.log(err);
  });

});


// dislike button
$(".main-content").on("click", 'button[class="dislikebtn"]', function() {
  console.log("inside dislike btn");
  var pc = $(this)
    .parent()
    .parent()
    .parent()
    .parent();

  var post_id = pc.data().id;
  console.log("logging likes postid")
  console.log(post_id)
  App.contracts.socialBlocks.deployed().then(function(instance) {
    return instance.onDislike(post_id)
  }).then(function(result) {
    // wait
    window.location.reload();
  }).catch(function(err) {
    console.log(err);
  });

});


// report button
$(".main-content").on("click", 'button[id="reportbtn"]', function() {
  console.log("inside report btn");
  var pc = $(this)
    .parent()
    .parent()
    .parent()
    .parent();

  var post_id = pc.data().id;
  console.log("logging likes postid")
  console.log(post_id)
  App.contracts.socialBlocks.deployed().then(function(instance) {
    return instance.onReport(post_id)
  }).then(function(result) {
    // wait
    window.location.reload();
  }).catch(function(err) {
    console.log(err);
  });

});

$(function() {
  $(window).load(function() {
    App.init();
  });
});