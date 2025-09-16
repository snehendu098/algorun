import { activeWalletAddress } from "@/constants";
import { addressCompress, totalStake } from "@/helpers/common";
import { ViewData } from "@/interfaces";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import Image from "next/image";

const UsersView = ({ stakes }: ViewData) => (
  <div className="mt-6 w-full">
    {/* User Header */}
    <div className="flex items-center w-full justify-between">
      {/* No. of Users */}
      <div className="flex space-x-2 items-center text-muted-foreground">
        <User />
        <p className="text-sm font-semibold">{stakes.length} Players</p>
      </div>

      {/* Total Coins Staked */}
      <div className="text-md font-semibold text-muted-foreground flex items-center">
        <Image src={"/rand.svg"} width={40} height={10} alt="rand" />
        {totalStake(stakes)}
      </div>
    </div>
    {/* Users */}
    <div className="w-full mt-4 space-y-4 pb-4">
      {stakes.map((item, idx) => (
        <div
          key={idx}
          className={cn(
            "p-4 bg-card rounded-xl",
            item.address === activeWalletAddress && "border-primary border-2"
          )}
        >
          <div className="flex items-center border-primary justify-between">
            <p className="text-md">
              {addressCompress(item.address.toString())}
            </p>
            <div className="text-md font-semibold text-muted-foreground flex items-center">
              <Image src={"/rand.svg"} width={40} height={10} alt="rand" />
              {item.stake}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UsersView;
