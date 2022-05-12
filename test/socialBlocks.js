var socialblock = artifacts.require("./contracts/socialBlocks.sol");

contract("socialblock", function(accounts) {
  var socialBlocksInstance;

  it("deployes successfully", function() {
    assert.notEqual(socialblock.address, "none")
    assert.notEqual(socialblock.address, "undefined")
    assert.notEqual(socialblock.address, "")
  });

  it(" user check", function() {
    return socialblock.deployed().then(function(instance) {
      socialBlocksInstance = instance;
      return socialBlocksInstance.addUser();
    }).then(function(res) {

      return socialBlocksInstance.users("0x8d8c68f4cd2dce6b4670fdb611c29807342f3433");
    }).then(function(user) {
      assert.equal(user[0].toString(), "0x8D8c68f4Cd2Dce6B4670FDb611c29807342f3433", "address of user matches");
      assert.equal("https://media.istockphoto.com/photos/full-length-shot-of-a-young-girl-sitting-in-the-hallway-at-school-and-picture-id1339040561?b=1&k=20&m=1339040561&s=170667a&w=0&h=cBIeSrYiP7lcIohC3aLHOYCH1X1nTG3wk4xTqn7eI74=", user[1], "profile pic matches")
      assert.equal(50, user[5], "reputation matches")
    });
  });

  it("Posts listing", function() {
    return socialblock.deployed().then(function(instance) {
      socialBlocksInstance = instance;
      return socialBlocksInstance.addPost("nature is bliss...", "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg");
    }).then(function(res) {
      return socialBlocksInstance.postcount();
    }).then(function(count) {
      assert.equal(count.toNumber(), 1);
      return socialBlocksInstance.posts(1);
    }).then(function(post) {
      assert.equal(post[0].toNumber(), 1, "id of post is correct");
      assert.equal(post[1], "nature is bliss...");
      assert.equal(post[2], "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg");
    });
  });

  it("likes posts", function() {
    return socialblock.deployed().then(function(instance) {
      socialBlocksInstance = instance;
      return socialBlocksInstance.onLike(1);
    }).then(function(res) {
      return socialBlocksInstance.posts(1);
    }).then(function(post) {
      assert.equal(post[3], 1);
    });
  });

  it("dislikes post", function() {
    return socialblock.deployed().then(function(instance) {
      socialBlocksInstance = instance;
      return socialBlocksInstance.onDislike(1);
    }).then(function(res) {
      return socialBlocksInstance.posts(1);
    }).then(function(post) {
      assert.equal(post[4], 1, "dislike incremented successfully");
    });
  });

  it("reports post", function() {
    return socialblock.deployed().then(function(instance) {
      socialBlocksInstance = instance;
      return socialBlocksInstance.onReport(1);
    }).then(function(res) {
      return socialBlocksInstance.posts(1);
    }).then(function(post) {
      assert.equal(post[5], 1, "report count incremented successfully");
    });
  });
});