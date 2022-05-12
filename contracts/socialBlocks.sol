pragma solidity ^0.5.0;

contract socialBlocks {

	//global variable for total number of post
	uint public postcount = 0;

	// post data structures and event
	struct post{
  	uint id;
		string content;
		string imgsrc;
		uint likecnt;
		uint dislikecnt;
		uint reportcnt;
		mapping (uint => address) reportlist;
		//string cmnt;
		bool isreported;
		address owner;
	}


	mapping(uint => post) public posts;

	event postadded(
  	uint id,
		string content,
		string imgsrc,
		uint likecnt,
		uint dislikecnt,
		uint reportcnt,
		//string cmnt;
		bool isreported,
		address owner
	);

//data structures for user
struct user{
	address useraddress;
	string profileimgsrc;
	uint likecnt;
	uint dislikecnt;
	uint reportcnt;
	uint reputation;
}

mapping(address => user) public users;
// function to add user in a go
function addUser() public {
//adding users manually
users[0x371Da44DD8a971F284A7e259c06Afb38613dfa8D] = user(0x371Da44DD8a971F284A7e259c06Afb38613dfa8D,"https://media.istockphoto.com/photos/full-length-shot-of-a-young-girl-sitting-in-the-hallway-at-school-and-picture-id1339040561?b=1&k=20&m=1339040561&s=170667a&w=0&h=cBIeSrYiP7lcIohC3aLHOYCH1X1nTG3wk4xTqn7eI74=",0,0,0,50);
users[0x5a404575d7fB80fEA200c148EbDc8A7BF6FE0201] = user(0x5a404575d7fB80fEA200c148EbDc8A7BF6FE0201,"https://media.istockphoto.com/photos/cute-little-african-american-girl-looking-at-camera-picture-id1353379172?b=1&k=20&m=1353379172&s=170667a&w=0&h=ATdapJAP1vVUkk67vcgxlV-Lg4LuXJNSP8N6awcStSo=",0,0,0,50);
users[0x8314AF307723326e337F10105d190aacEDaA7129] = user(0x8314AF307723326e337F10105d190aacEDaA7129,"https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688?k=20&m=517188688&s=612x612&w=0&h=i38qBm2P-6V4vZVEaMy_TaTEaoCMkYhvLCysE7yJQ5Q=",0,0,0,50);
users[0x220eD39Bc8BDdb59ba4237b8829fbBFD23926600] = user(0x220eD39Bc8BDdb59ba4237b8829fbBFD23926600,"https://images.pexels.com/photos/302743/pexels-photo-302743.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",0,0,0,50);
users[0x29b2ae56DE9CbC99822df7339a576e37E0d21092] = user(0x29b2ae56DE9CbC99822df7339a576e37E0d21092,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkE0wnWYLNyBlPHAMHCf3sJmsJWqaGIYdY5s-hV08VGN3b4KP4NcmvZuyGtNMJoBsAHFk&usqp=CAU",0,0,0,50);
users[0x2531945d51328BB24F519de9EB41d33f77cb6398] = user(0x2531945d51328BB24F519de9EB41d33f77cb6398,"https://cdn.pixabay.com/photo/2013/07/21/13/00/rose-165819__340.jpg",0,0,0,50);
users[0xee1249D4040A43a429aD5eC1F7C536265822139C] = user(0xee1249D4040A43a429aD5eC1F7C536265822139C,"https://m.media-amazon.com/images/I/71TDmV9JVaL._SL1500_.jpg",0,0,0,50);
users[0x28A8F02ABd0595e203131CDDd24344BCdfd05481] = user(0x28A8F02ABd0595e203131CDDd24344BCdfd05481,"https://i.pinimg.com/736x/ec/07/46/ec0746243a148dbdc11f467996027249.jpg",0,0,0,50);
users[0x0E40aC73Ecb30E7201fE376ca7279DFdC7c2A323] = user(0x0E40aC73Ecb30E7201fE376ca7279DFdC7c2A323,"https://www.designyourway.net/blog/wp-content/uploads/2018/08/387011_3d-cute-wallpapers-for-desktop-hd-1-jpg_1024x768_h-700x525.jpg",0,0,0,50);
users[0x5Eb6F8Ed0CFbFB1FCf4d5AFe23619941b61A56b7] = user(0x5Eb6F8Ed0CFbFB1FCf4d5AFe23619941b61A56b7,"https://upload.wikimedia.org/wikipedia/commons/2/2a/New_Logo_AD.jpg",0,0,0,50);
}



//function to add post
	function addPost(string memory _content, string memory _imgsrc) public{

		postcount++;
		posts[postcount] = post(postcount,_content,_imgsrc,0,0,0,false,msg.sender);
		emit postadded(postcount,_content,_imgsrc,0,0,0,false,msg.sender);
	}

	event liked(
		uint id,
		uint plikecnt,
		uint ulikecnt
	);


	function onLike(uint _id) public {
		post memory _ptemp = posts[_id] ;
		_ptemp.likecnt +=1;
		posts[_id] = _ptemp;

		user memory _utemp = users[_ptemp.owner];
		_utemp.likecnt +=1;
		users[_ptemp.owner] = _utemp ;

		emit liked(_id,_ptemp.likecnt,_utemp.likecnt);
	}

	event disliked(
		uint id,
		uint pdislikecnt,
		uint udislikecnt
	);
	function onDislike(uint _id) public {
		post memory _ptemp = posts[_id] ;
		_ptemp.dislikecnt +=1;
		posts[_id] = _ptemp;

		user memory _utemp = users[_ptemp.owner];
		_utemp.dislikecnt +=1;
		users[_ptemp.owner] = _utemp ;

		emit disliked(_id,_ptemp.dislikecnt,_utemp.dislikecnt);
	}


	event reported(
		uint id,
		uint preportcnt,
		bool isreported,
		uint ureportcnt
	);
	function onReport(uint _id) public {

		post storage _ptemp = posts[_id] ;
		_ptemp.reportcnt +=1;

		// filling the report list to know who all reported the post
		_ptemp.reportlist[_ptemp.reportcnt] = msg.sender;

		// reported greater that 25%
		if(_ptemp.reportcnt>=6){
			_ptemp.isreported = true;
		}
		posts[_id] = _ptemp;

		user memory _utemp = users[_ptemp.owner];
		_utemp.reportcnt +=1;
		if(_ptemp.isreported){
			 _utemp.reputation -= 8;
		}
		users[_ptemp.owner] = _utemp ;

		emit reported(_id,_ptemp.dislikecnt,_ptemp.isreported,_utemp.reportcnt);
	}

	function settlement() public{
		// traversing posts for report award penalty
		for(uint i =1; i<=postcount;i++){
			if(posts[i].isreported){
				//award reputation
				for(uint k=1; k<=posts[i].reportcnt;k++){
					user memory _utemp = users[posts[i].reportlist[k]];
					_utemp.reputation += 2;
					users[posts[i].reportlist[k]] = _utemp;
				}
			}
			else{
				//penalize reputation
				for(uint k=1; k<=posts[i].reportcnt;k++){
					user memory _utemp = users[posts[i].reportlist[k]];
					_utemp.reputation -= 1;
					if(_utemp.reputation<0){
						_utemp.reputation=0;
					}
					users[posts[i].reportlist[k]] = _utemp;
				}
			}
		}

		// traversing users for like/dislike reward
		for (uint j=0;j<20;j++){
			// award ether...
		}
	}

}
