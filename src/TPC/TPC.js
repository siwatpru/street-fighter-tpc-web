import React, { Component } from "react";
import "./TPC.css";
import socketIOClient from "socket.io-client";

import player1 from "../accets/tpc_player_v1/tpc_sprite_player_A.gif";
import player1Charge from "../accets/tpc_player_v1/tpc_sprite_player_A_charge.gif";
import player1Attack from "../accets/tpc_player_v1/tpc_sprite_player_A_attack.gif";
import player1Shield from "../accets/tpc_player_v1/tpc_sprite_player_A_shield.gif";
import player2 from "../accets/tpc_player_v1/tpc_sprite_player_B.gif";
import player2Charge from "../accets/tpc_player_v1/tpc_sprite_player_B_charge.gif";
import player2Attack from "../accets/tpc_player_v1/tpc_sprite_player_B_attack.gif";
import player2Shield from "../accets/tpc_player_v1/tpc_sprite_player_B_shield.gif";

import shield from "../accets/tpc_player_v1/tpc_sprite_shield.png";

const ACTION = {
  TOB: 0,
  PAE: 1,
  CHARGE: 2,
  ATTACK: 3,
  DEFEND: 4
};

class TPC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      roomID: 5555, // (Math.random() * 10000) >>> 0,
      isPlayer1Active: false,
      isPlayer2Active: false,
      endpoint: "http://192.168.180.228:5000",
      room: {},
      winnerID: 0
    };
  }

  printAction(action) {
    switch (action) {
      case ACTION.TOB:
        return "TOB";
      case ACTION.PAE:
        return "PAE";
      case ACTION.CHARGE:
        return "CHARGE";
      case ACTION.ATTACK:
        return "ATTACK";
      case ACTION.DEFEND:
        return "DEFEND";
      default:
        return "UNKNOWN";
    }
  }

  componentDidMount() {
    const socket = socketIOClient(this.state.endpoint);

    socket.on("connect", () => {
      console.log("connect to Nan");
    });

    socket.on("player_join", ({ roomId, playerNumber }) => {
      console.log(this.state.roomID + " and " + roomId);
      if (this.state.roomID === roomId) {
        if (playerNumber === 1) {
          console.log("player 1 join the game");
          this.setState({ isPlayer1Active: true });
        } else if (playerNumber === 2) {
          console.log("player 2 join the game");
          this.setState({ isPlayer2Active: true });
        }
      }
      this.setState({ page: 1 });
    });

    socket.on("game_start", ({ room }) => {
      console.log("GAME START ");
      this.setState({ room, page: 3 });
    });

    socket.on("game_state", room => {
      console.log("GAME STATE: " + room);
      this.setState({ room });
    });

    socket.on("game_end", ({ roomId, playerWin }) => {
      console.log("Room number #" + roomId);
      this.setState({ winnerID: playerWin, page: 4 });
    });
  }

  onValueChange = e => {
    this.setState({
      roomID: e.target.value
    });
  };

  changePage(pageNum) {
    this.setState({ page: pageNum });
  }

  getPageLobby() {
    var QRCode = require("qrcode.react");
    return (
      <div className="TPC">
        <header className="TPC-header">
          <img src={shield} className="TPC-logo" alt="logo" />
          <h1 className="TPC-title">Tob-Pae-Charge</h1>
        </header>
        <main>
          <div className="Lobby-qr">
            <QRCode value={this.state.roomID.toString()} size={200} />
            <br />
            <input
              type="text"
              value={this.state.roomID}
              onChange={this.onValueChange}
            />
          </div>
          <div>
            <p
              className={
                "Lobby-player-blog " +
                (this.state.isPlayer1Active === true ? "active" : "inactive")
              }
            >
              Player 1
            </p>
            <p
              className={
                "Lobby-player-blog " +
                (this.state.isPlayer2Active === true ? "active" : "inactive")
              }
            >
              Player 2
            </p>
          </div>
        </main>
      </div>
    );
  }

  getPage2() {
    return (
      <div>
        <header className="TPC-header">
          <img src={player1} className="TPC-logo" alt="logo" />
          <h1 className="TPC-title">Tob-Pae-Charge</h1>
        </header>
        <img
          src={player1}
          className="TPC-logo"
          alt="logo"
          onClick={() => this.changePage(3)}
        />
      </div>
    );
  }

  getPageFighting() {
    return (
      <div className="TPC">
        <main>
          <div className="fighting-split fighting-left fighting-block">
            <div className="fighting-centered fighting-block fighting-action-board">
              <p className="block">
                {this.printAction(
                  this.state.room[this.state.roomID].player1.lastAction
                )}
              </p>
            </div>
            <div className="fighting-centered fighting-block">
              <img
                src={
                  this.state.room[this.state.roomID].player1.lastAction
                      === ACTION.DEFEND
                    ? player1Shield
                    : this.state.room[this.state.roomID].player1.lastAction
                        === ACTION.ATTACK
                      ? player1Attack
                      : this.state.room[this.state.roomID].player1.charge >= 3
                        ? player1Charge
                        : player1
                }
                className="fighting-player TPC-logo"
                alt="Player 1 character"
                onClick={() => this.changePage(4)}
              />
            </div>
            <div className="fighting-block">
              <p className="block">
                HP: {this.state.room[this.state.roomID].player1.hp}
              </p>
              <p className="block">
                CHARGED: {this.state.room[this.state.roomID].player1.charge}
              </p>
            </div>
          </div>
          <div className="fighting-split fighting-right fighting-block">
            <div className="fighting-centered fighting-block fighting-action-board">
              <p className="block">
                {this.printAction(
                  this.state.room[this.state.roomID].player2.lastAction
                )}
              </p>
            </div>
            <div className="fighting-centered fighting-block">
              <img
                src={
                  this.state.room[this.state.roomID].player2.lastAction
                      === ACTION.DEFEND
                    ? player2Shield
                    : this.state.room[this.state.roomID].player2.lastAction
                        === ACTION.ATTACK
                      ? player2Attack
                      : this.state.room[this.state.roomID].player2.charge >= 3
                        ? player2Charge
                        : player2
                }
                className="fighting-player TPC-logo"
                alt="Player 2 character"
              />
            </div>
            <div className="fighting-block">
              <p className="block">
                HP: {this.state.room[this.state.roomID].player2.hp}
              </p>
              <p className="block">
                CHARGED: {this.state.room[this.state.roomID].player2.charge}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  getWinner(winner) {
    return (
      <div className="TPC">
        <header className="TPC-header">
          <img
            src={shield}
            className="TPC-logo"
            alt="logo"
            onClick={() => this.changePage(1)}
          />
          <h1 className="TPC-title">Tob-Pae-Charge</h1>
        </header>
        <main>
          <div className="fighting-centered fighting-block full-width">
            <img
              src={this.state.winnerID === 1 ? player1 : player2}
              className="fighting-player-small TPC-logo"
              alt="winner of TPC"
            />
          </div>
          <div className="fighting-centered fighting-block full-width">
            <p className="block charged">
              WINNER: Player {this.state.winnerID}
            </p>
          </div>
        </main>
      </div>
    );
  }

  getPage() {
    if (this.state.page === 1) {
      return this.getPageLobby();
    } else if (this.state.page === 2) {
      return this.getPage2();
    } else if (this.state.page === 3) {
      return this.getPageFighting();
    } else if (this.state.page === 4) {
      return this.getWinner();
    } else {
      return this.getPageLobby();
    }
  }

  render() {
    return <div>{this.getPage()}</div>;
  }
}

export default TPC;
