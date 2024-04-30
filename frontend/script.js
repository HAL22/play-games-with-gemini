
window.onload = function () {
    //The initial setup
    var gameBoard = [
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0]
    ];
    //arrays to store the instances
    var pieces = [];
    var tiles = [];

    //arrays used to store the html objects
    var htmlTiles = []
    var htmlPieces = []
  
    //distance formula
    var dist = function (x1, y1, x2, y2) {
      return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    }
    //Piece object - there are 24 instances of them in a checkers game
    function Piece(element, position) {
      // when jump exist, regular move is not allowed
      // since there is no jump at round 1, all pieces are allowed to move initially
      this.allowedtomove = true;
      //linked DOM element
      this.element = element;
      //positions on gameBoard array in format row, column
      this.position = position;
      //which player's piece i it
      this.player = '';
      //figure out player by piece id
      if (this.element.attr("id") < 12)
        this.player = 1;
      else
        this.player = 2;
      //makes object a king
      this.king = false;
      this.makeKing = function () {
        this.element.css("backgroundImage", "url('img/king" + this.player + ".png')");
        this.king = true;
      }
      //moves the piece
      this.move = function (tile) {
        console.log(tile)
        this.element.removeClass('selected');
        if (!Board.isValidPlacetoMove(tile.position[0], tile.position[1])) return false;
        //make sure piece doesn't go backwards if it's not a king
        if (this.player == 1 && this.king == false) {
          if (tile.position[0] < this.position[0]) return false;
        } else if (this.player == 2 && this.king == false) {
          if (tile.position[0] > this.position[0]) return false;
        }
        //remove the mark from Board.board and put it in the new spot
        Board.board[this.position[0]][this.position[1]] = 0;
        // store old position
        x1 = this.position[0]
        y1 = this.position[1]
        Board.board[tile.position[0]][tile.position[1]] = this.player;
        this.position = [tile.position[0], tile.position[1]];
        // changing piece 
        Board.move_piece(x1,y1,tile.position[0],tile.position[1])
        //change the css using board's dictionary
        this.element.css('top', Board.dictionary[this.position[0]]);
        this.element.css('left', Board.dictionary[this.position[1]]);
        //if piece reaches the end of the row on opposite side crown it a king (can move all directions)
        if (!this.king && (this.position[0] == 0 || this.position[0] == 7))
          this.makeKing();
        return true;
      };
  
      //tests if piece can jump anywhere
      this.canJumpAny = function () {
        return (this.canOpponentJump([this.position[0] + 2, this.position[1] + 2]) ||
          this.canOpponentJump([this.position[0] + 2, this.position[1] - 2]) ||
          this.canOpponentJump([this.position[0] - 2, this.position[1] + 2]) ||
          this.canOpponentJump([this.position[0] - 2, this.position[1] - 2]))
      };
  
      //tests if an opponent jump can be made to a specific place
      this.canOpponentJump = function (newPosition) {
        //find what the displacement is
        var dx = newPosition[1] - this.position[1];
        var dy = newPosition[0] - this.position[0];
        //make sure object doesn't go backwards if not a king
        if (this.player == 1 && this.king == false) {
          if (newPosition[0] < this.position[0]) return false;
        } else if (this.player == 2 && this.king == false) {
          if (newPosition[0] > this.position[0]) return false;
        }
        //must be in bounds
        if (newPosition[0] > 7 || newPosition[1] > 7 || newPosition[0] < 0 || newPosition[1] < 0) return false;
        //middle tile where the piece to be conquered sits
        var tileToCheckx = this.position[1] + dx / 2;
        var tileToChecky = this.position[0] + dy / 2;
        if (tileToCheckx > 7 || tileToChecky > 7 || tileToCheckx < 0 || tileToChecky < 0) return false;
        //if there is a piece there and there is no piece in the space after that
        if (!Board.isValidPlacetoMove(tileToChecky, tileToCheckx) && Board.isValidPlacetoMove(newPosition[0], newPosition[1])) {
          //find which object instance is sitting there
          for (let pieceIndex in pieces) {
            if (pieces[pieceIndex].position[0] == tileToChecky && pieces[pieceIndex].position[1] == tileToCheckx) {
              if (this.player != pieces[pieceIndex].player) {
                //return the piece sitting there
                return pieces[pieceIndex];
              }
            }
          }
        }
        return false;
      };
  
      this.opponentJump = function (tile) {
        var pieceToRemove = this.canOpponentJump(tile.position);
        //if there is a piece to be removed, remove it
        if (pieceToRemove) {
          pieceToRemove.remove();
          return true;
        }
        return false;
      };
  
      this.remove = function () {
        //remove it and delete it from the gameboard
        this.element.css("display", "none");
        if (this.player == 1) {
          $('#player2').append("<div class='capturedPiece'></div>");
          Board.score.player2 += 1;
        }
        if (this.player == 2) {
          $('#player1').append("<div class='capturedPiece'></div>");
          Board.score.player1 += 1;
        }
        Board.board[this.position[0]][this.position[1]] = 0;
         // changing piece 
         Board.move_piece(this.position[0],this.position[1],-1,-1)
        //reset position so it doesn't get picked up by the for loop in the canOpponentJump method
        this.position = [];
        var playerWon = Board.checkifAnybodyWon();
        if (playerWon) {
          $('#winner').html("Player " + playerWon + " has won!");
        }
      }
    }
  
    function Tile(element, position) {
      //linked DOM element
      this.element = element;
      //position in gameboard
      this.position = position;
      //if tile is in range from the piece
      this.inRange = function (piece) {
        for (let k of pieces)
          if (k.position[0] == this.position[0] && k.position[1] == this.position[1]) return 'wrong';
        if (!piece.king && piece.player == 1 && this.position[0] < piece.position[0]) return 'wrong';
        if (!piece.king && piece.player == 2 && this.position[0] > piece.position[0]) return 'wrong';
        if (dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == Math.sqrt(2)) {
          //regular move
          return 'regular';
        } else if (dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == 2 * Math.sqrt(2)) {
          //jump move
          return 'jump';
        }
      };
    }
  
    //Board object - controls logistics of game
    var Board = {
      board: gameBoard,
      score: {
        player1: 0,
        player2: 0
      },
      playerTurn: 1,
      jumpexist: false,
      continuousjump: false,
      tilesElement: $('div.tiles'),
      //dictionary to convert position in Board.board to the viewport units
      dictionary: ["0vmin", "10vmin", "20vmin", "30vmin", "40vmin", "50vmin", "60vmin", "70vmin", "80vmin", "90vmin"],
      //initialize the 8x8 board
      initalize: function () {
        var countPieces = 0;
        var countTiles = 0;
        for (let row in this.board) { //row is the index
          for (let column in this.board[row]) { //column is the index
            //whole set of if statements control where the tiles and pieces should be placed on the board
            if (row % 2 == 1) {
              if (column % 2 == 0) {
                countTiles = this.tileRender(row, column, countTiles)
              }
            } else {
              if (column % 2 == 1) {
                countTiles = this.tileRender(row, column, countTiles)
              }
            }
            if (this.board[row][column] == 1) {
              countPieces = this.playerPiecesRender(1, row, column, countPieces)
            } else if (this.board[row][column] == 2) {
              countPieces = this.playerPiecesRender(2, row, column, countPieces)
            }
          }
        }
      },
      tileRender: function (row, column, countTiles) {
        item = "<div class='tile' id='tile" + countTiles + "' style='top:" + this.dictionary[row] + ";left:" + this.dictionary[column] + ";'></div>";
        htmlItem = {
            id: "tile"+countTiles,
            row: row,
            column: column
        };
        htmlTiles.push(htmlItem)

        if(row == 4 && column == 1){
            console.log("tile ==    "+htmlItem.id);
        }


        this.tilesElement.append("<div class='tile' id='tile" + countTiles + "' style='top:" + this.dictionary[row] + ";left:" + this.dictionary[column] + ";'></div>");
        tiles[countTiles] = new Tile($("#tile" + countTiles), [parseInt(row), parseInt(column)]);
        return countTiles + 1
      },
  
      playerPiecesRender: function (playerNumber, row, column, countPieces) {
        item = "<div class='piece' id='" + countPieces + "' style='top:" + this.dictionary[row] + ";left:" + this.dictionary[column] + ";'></div>";

        htmlItem = {
            id:countPieces,
            row:row,
            column:column
        };


        htmlPieces.push(htmlItem);

        if(countPieces == 12){
            console.log("row: "+row+" col: "+column)
        }

        if(playerNumber == 2 && row == 5 && column == 0){
            console.log("id: "+countPieces);

        }


        $(`.player${playerNumber}pieces`).append("<div class='piece' id='" + countPieces + "' style='top:" + this.dictionary[row] + ";left:" + this.dictionary[column] + ";'></div>");
        pieces[countPieces] = new Piece($("#" + countPieces), [parseInt(row), parseInt(column)]);
        return countPieces + 1;
      },
      //check if the location has an object
      isValidPlacetoMove: function (row, column) {
        // console.log(row); console.log(column); console.log(this.board);
        if (row < 0 || row > 7 || column < 0 || column > 7) return false;
        if (this.board[row][column] == 0) {
          return true;
        }
        return false;
      },
      //change the active player - also changes div.turn's CSS
      changePlayerTurn: function () {
        if (this.playerTurn == 1) {
          this.playerTurn = 2;
          $('.turn').css("background", "linear-gradient(to right, transparent 50%, #BEEE62 50%)");
        } else {
          this.playerTurn = 1;
          $('.turn').css("background", "linear-gradient(to right, #BEEE62 50%, transparent 50%)");
        }
        // this.check_if_jump_exist()

        if(this.playerTurn == 2){
            this.gemini_move("");
        }

        return;
      },
      checkifAnybodyWon: function () {
        if (this.score.player1 == 12) {
          return 1;
        } else if (this.score.player2 == 12) {
          return 2;
        }
        return false;
      },
      //reset the game
      clear: function () {
        location.reload();
      },
      check_if_jump_exist: function () {
        this.jumpexist = false
        this.continuousjump = false;
        for (let k of pieces) {
          k.allowedtomove = false;
          // if jump exist, only set those "jump" pieces "allowed to move"
          if (k.position.length != 0 && k.player == this.playerTurn && k.canJumpAny()) {
            this.jumpexist = true
            k.allowedtomove = true;
          }
        }
        // if jump doesn't exist, all pieces are allowed to move
        if (!this.jumpexist) {
          for (let k of pieces) k.allowedtomove = true;
        }
      },
      // Possibly helpful for communication with back-end.
      str_board: function () {
        ret = ""
        for (let i in this.board) {
          for (let j in this.board[i]) {
            var found = false
            for (let k of pieces) {
              if (k.position[0] == i && k.position[1] == j) {
                if (k.king) ret += (this.board[i][j] + 2)
                else ret += this.board[i][j]
                found = true
                break
              }
            }
            if (!found) ret += '0'
          }
        }
        return ret
      },

    

      find_tile_id: function (row,column) {
        let id = "";
        htmlTiles.forEach((element,index) => {
            if(element.column == column && element.row == row){
                return id = element.id;
            }
        })

        return id;
      },

      find_piece_id: function (row,column) {
        let id = -1;
        htmlPieces.forEach((element) => {
            if(parseInt(element.column) === parseInt(column) && parseInt(element.row) === parseInt(row)){
                id =  element.id;
            }
        })

        return id;
      },

      move_piece: function(x1,y1,x2,y2){
        htmlPieces.forEach((element,index) => {
          if(parseInt(element.column) === parseInt(y1) && parseInt(element.row) === parseInt(x1)){
              htmlPieces[index] = {
                id:element.id,
                row:x2,
                column:y2
              }
          }
      })
      },

      gemini_move: function(error_message){
        const apiUrl = 'http://localhost:8000/play';

        b = {
            board: this.board,
            error: error_message
        }

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(b),
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        };

        fetch(apiUrl,requestOptions).then(response => {
            if(!response.ok){
                console.log(response);
                throw new Error('Network response was not ok');
                
            }
            return response.json();
        })
        .then(data => {
            let clickEvent = new Event('click');

            let pieceId = this.find_piece_id(data.x1,data.y1)
            if(pieceId == -1){
                throw new Error('Piece coordinates do not exist')
            }
           
            const piece = document.getElementById(pieceId);

            let tileId = this.find_tile_id(data.x2,data.y2);
            if(tileId == ""){
                throw new Error('Tile coordinates do not exist')
            }

            const tile = document.getElementById(tileId);

            piece.dispatchEvent(clickEvent);

            tile.dispatchEvent(clickEvent);
        })
        .catch(error => {
            console.error('Error:',error);

        });
      }
    }
  
    //initialize the board
    Board.initalize();
  
    /***
    Events
    ***/
  
    //select the piece on click if it is the player's turn
    $('.piece').on("click", function () {
      var selected;
      var isPlayersTurn = ($(this).parent().attr("class").split(' ')[0] == "player" + Board.playerTurn + "pieces");
      if (isPlayersTurn) {
        
        if (pieces[$(this).attr("id")].allowedtomove) {
          
          if ($(this).hasClass('selected')) selected = true;
          $('.piece').each(function (index) {
            $('.piece').eq(index).removeClass('selected')
          });
          if (!selected) {
            $(this).addClass('selected');
          }
        } else {
          let exist = "jump exist for other pieces, that piece is not allowed to move"
          let continuous = "continuous jump exist, you have to jump the same piece"
          let message = !Board.continuousjump ? exist : continuous
          console.log(message)
          if(Board.playerTurn == 2){
            Board.gemini_move(message);
          }
        }
      }
    });
  
    //reset game when clear button is pressed
    $('#cleargame').on("click", function () {
      Board.clear();
    });
  
    //move piece when tile is clicked
    $('.tile').on("click", function () {
      //make sure a piece is selected
      if ($('.selected').length != 0) {
        //find the tile object being clicked
        var tileID = $(this).attr("id").replace(/tile/, '');

        var tile = tiles[tileID];
        //find the piece being selected
        var piece = pieces[$('.selected').attr("id")];
        //check if the tile is in range from the object
        var inRange = tile.inRange(piece);
        if (inRange != 'wrong') {
          console.log("Move: " + inRange)
          //if the move needed is jump, then move it but also check if another move can be made (double and triple jumps)
          if (inRange == 'jump') {
            if (piece.opponentJump(tile)) {
              console.log("Can Jump move")
              piece.move(tile);
              if (piece.canJumpAny()) {
                // Board.changePlayerTurn(); //change back to original since another turn can be made
                piece.element.addClass('selected');
                // exist continuous jump, you are not allowed to de-select this piece or select other pieces
                Board.continuousjump = true;
              } else {
                Board.changePlayerTurn()
              }
            } else{
              // another move
              console.log("Can't jump")
              if(Board.playerTurn == 2){
                console.log("here  3    " + inRange)
                Board.gemini_move("Cannot make this move")
              }
            }
            //if it's regular then move it if no jumping is available
          } else if (inRange == 'regular' && !Board.jumpexist) {
            if (!piece.canJumpAny()) {
              piece.move(tile);
              console.log("You must jump when possible!")
              Board.changePlayerTurn()
            } else {
              piece.move(tile);
              Board.changePlayerTurn()
              console.log("You must jump when possible!")
              // alert("You must jump when possible!");
            }
          }
        }
      }
    });
  }
  