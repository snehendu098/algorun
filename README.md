# Algorun 🚀

A real-time crash game built on the Algorand blockchain, featuring WebSocket-based multiplayer gameplay and smart contract integration for transparent game results.

## 🌟 Features

- **Real-time multiplayer gameplay** with WebSocket connections
- **Blockchain integration** using Algorand smart contracts
- **Transparent game mechanics** with on-chain result storage
- **Queue system** for seamless game transitions
- **Dynamic multiplier progression** with real-time updates
- **Instant withdrawals** during active games

## 🔗 Live Links

- **Live App**: https://algorun-woad.vercel.app/
- **Contract**: https://testnet.explorer.perawallet.app/application/745912429/

## 🎮 How It Works

Algorun is a crash game where players:
1. **Join** a game round by placing bets
2. **Watch** the multiplier increase in real-time
3. **Withdraw** before the crash to secure winnings
4. **Risk vs Reward**: Higher multipliers mean bigger payouts, but greater crash risk

### Game Phases

- **Waiting Phase** (15s): Players can join the upcoming round
- **Running Phase**: Multiplier increases until crash point
- **Ended Phase** (2s): Results are finalized and saved to blockchain

## 🏗️ Architecture

### Smart Contract (Algorand)

The project uses a custom Algorand smart contract (`CrashGame`) deployed on testnet:

```typescript
// Main contract method for storing game results
setGameData(gameid: string, crashAt: string, date: string): void
```

**Contract Features:**
- Stores game results immutably on-chain
- Provides transparency for all game outcomes
- Built using Algorand TypeScript SDK

### Backend (Bun + WebSocket)

The game server handles:
- Real-time WebSocket connections
- Game state management
- Player join/withdraw logic
- Blockchain transactions
- Queue management for seamless gameplay

**Key Components:**
- `GameManager`: Core game logic and state management
- `WebSocket Server`: Real-time communication with clients
- `Game Functions`: Blockchain integration and payout processing

## 🛠️ Technology Stack

- **Blockchain**: Algorand (Testnet)
- **Runtime**: Bun
- **Framework**: Hono (Lightweight web framework)
- **Smart Contracts**: Algorand TypeScript SDK
- **Communication**: WebSockets for real-time updates
- **Frontend**: Next.js (deployed on Vercel)

## 🚀 Getting Started

### Prerequisites

- Bun runtime
- Algorand wallet (for testnet)
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd algorun
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your GAME_CREATOR_MNEMONIC and other required variables
```

4. Start the development server:
```bash
bun run dev
```

The server will start on `http://localhost:3001`

### Environment Variables

```env
GAME_CREATOR_MNEMONIC=your_algorand_wallet_mnemonic_here
```

## 📡 API Endpoints

### HTTP Endpoints

- `GET /` - Health check
- `GET /game/state` - Current game state

### WebSocket Events

#### Client → Server
```typescript
// Join current game or queue for next round
{ type: 'join_game', address: string, amount: number, transactionId?: string }

// Withdraw from current game
{ type: 'withdraw', address: string }

// Get current multiplier
{ type: 'get_multiplier' }
```

#### Server → Client
```typescript
// Game state updates
{ type: 'game_state', data: GameState }
{ type: 'multiplier_update', multiplier: number, timestamp: number }
{ type: 'player_joined', address: string, amount: number, stakes: Stake[] }
{ type: 'player_withdrew', address: string, multiplier: number, payout: number }
{ type: 'game_started', stakes: Stake[], totalPlayers: number }
{ type: 'game_ended', crashAt: number, survivingPlayers: string[] }
```

## 🔧 Smart Contract Details

The `CrashGame` contract is deployed on Algorand Testnet:

**Application ID**: `745912429`

**Key Features:**
- Immutable game result storage
- Global state variables: `gameid`, `crashAt`, `date`
- ABI method: `setGameData(string,string,string)void`

## 🧪 Testing

Connect to the WebSocket server:
```javascript
const ws = new WebSocket('ws://localhost:3001/ws');

// Join game
ws.send(JSON.stringify({
  type: 'join_game',
  address: 'your_algorand_address',
  amount: 1.0
}));
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support and questions:
- Create an issue on GitHub
- Check the [live app](https://algorun-woad.vercel.app/) for the latest version
- Review the [smart contract](https://testnet.explorer.perawallet.app/application/745912429/) on Algorand Explorer

## 🏆 Acknowledgments

- Built with Algorand blockchain technology
- Powered by Bun runtime for optimal performance
- Real-time gaming made possible with WebSocket technology

---

**⚠️ Disclaimer**: This is a testnet application for demonstration purposes. Use at your own risk.
