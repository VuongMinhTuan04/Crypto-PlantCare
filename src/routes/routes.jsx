import LayoutCho from "@/DefaultLayouts/LayoutCho";
import LayoutGame from "@/DefaultLayouts/LayoutGame";
import GameScreen from "@/pages/gameUI";
import ShopPage from "@/pages/gameUI/GameShopping";
import InviteBonus from "@/pages/invitebonus";
import LoginPage from "@/pages/login";
import FoundWallet from "@/pages/login2";
import Swap from "@/pages/login3";
import Mint from "@/pages/login4";
import EarnApp from "@/pages/ReferAndEarn";
import Wallet from "@/pages/wallet";
import * as Components from '@/routes/lazycomponents';
const publicRoutes = [
  { path: "/", component: LoginPage, layout: LayoutGame },
  { path: "/game-login", component: Components.LoginPage, layout: LayoutCho },

];

const privateRoutes = [
  { path: "/game-login/waitinggame", component: Components.GameWaitingPage, layout: LayoutCho },
  { path: "/game-login/solana", component: FoundWallet, layout: LayoutGame },
  { path: "/game-login/solana/deposite", component: Swap, layout: LayoutGame },
  {
    path: "/game-login/solana/deposite/mint",
    component: Mint,
    layout: LayoutCho,
  },
  { path: "/game-invitebonus", component: InviteBonus, layout: LayoutGame },
  { path: "/game-shopping", component: ShopPage, layout: LayoutGame },
  { path: "/wallet", component: Wallet, layout: LayoutGame },
  {
    path: "/game-playing/activities/referandearn",
    component: EarnApp,
    layout: LayoutGame,
  },
  { path: "/game-playing/*", component: GameScreen, layout: LayoutGame },
];

export { privateRoutes, publicRoutes };

