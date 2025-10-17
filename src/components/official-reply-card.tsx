
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "./logo";

export function OfficialReplyCard() {
  return (
    <Card className="bg-primary/10 border-primary/50 p-4">
      <CardContent className="p-0 flex items-start gap-4">
        <Logo showText={false} />
        <div className="flex-1">
          <p className="font-bold text-primary">A Message from My Fin NG</p>
          <div className="text-sm text-muted-foreground mt-2 space-y-3">
            <p>
              We love hearing your success stories! We see your comments about waiting for withdrawals, and we want to be transparent about how we make this possible.
            </p>
            <p>
              My Fin NG is more than just a wallet; it's an investment platform. When you deposit funds or earn through mining, that capital is put to work in our diversified portfolio, which includes automated trading bots, staking, and liquidity pools. This is how we generate the high returns you enjoy.
            </p>
            <p>
              The withdrawal delay you sometimes experience is because your funds are actively invested. Our system needs time to safely divest the amount you request and process the payment. We appreciate your patience, as it's a necessary step to ensure the platform remains profitable and sustainable for everyone.
            </p>
            <p className="font-semibold text-primary/90">
              Thank you for being part of the My Fin NG community!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
