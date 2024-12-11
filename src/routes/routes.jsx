
import LayoutGame from "@/DefaultLayouts/LayoutGame";
import LayoutWebsite from "@/DefaultLayouts/LayoutWebsite";
import GameScreen from "@/pages/gameUI";
import ShopPage from "@/pages/gameUI/GameShopping";
import Home from "@/pages/home";
import InviteBonus from "@/pages/invitebonus";
import LoginPage from "@/pages/login";
import FoundWallet from "@/pages/login2";
import Swap from "@/pages/login3";
import Mint from "@/pages/login4";
import EarnApp from "@/pages/ReferAndEarn";
import Wallet from "@/pages/wallet";
const publicRoutes = [
  { path: "/", component: Home, layout: LayoutWebsite },
  { path: "/game-playing/*", component: GameScreen, layout: LayoutGame },
  { path: "/game-playing/activities/referandearn", component: EarnApp, layout: LayoutGame },
  { path: "/game-login", component: LoginPage, layout: LayoutGame },
  { path: "/game-login/solana", component: FoundWallet, layout: LayoutGame },
  { path: "/game-login/solana/deposite", component: Swap, layout: LayoutGame },
  { path: "/game-login/solana/deposite/mint", component: Mint, layout: LayoutGame },  
  { path: "/game-invitebonus", component: InviteBonus, layout: LayoutGame },
  { path: "/game-shopping", component: ShopPage, layout: LayoutGame },
  { path: "/wallet", component: Wallet, layout: LayoutGame },
  // { path: "/wallet/information", component: WalletBalance, layout: LayoutGame },
];

const privateRoutes = [];

export { privateRoutes, publicRoutes };

 