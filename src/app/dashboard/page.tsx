
"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Wallet,
  Landmark,
  History,
  Pickaxe,
  CircleDollarSign,
  User,
  Hash,
  Share2,
  Phone,
  Eye,
  EyeOff,
  Timer,
  Users,
  Facebook,
  Star,
  Youtube,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingLink } from "@/components/ui/loading-link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode.react";
import { cn } from "@/lib/utils";
import { addTransaction } from "@/lib/transactions";
import { Progress } from "@/components/ui/progress";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

const MINING_AMOUNT_PER_TAP = 250;
const MAX_FREE_TAPS = 0; // Free taps are now claimed from the store
const MINIMUM_WITHDRAWAL = 50000;

const sampleNames = [
    "Chinedu Okoro", "Fatima Bello", "Tunde Adebayo", "Aisha Ibrahim", "Emeka Nwosu", "Ngozi Eze",
    "Musa Garba", "Funke Adewale", "Ibrahim Lawal", "Chioma Philips", "Abubakar Sani", "Folake Ojo",
    "David Adekunle", "Zainab Suleiman", "Oluwaseun Martins", "Halima Bello", "Victor Uche", "Gift Eke",
    "Samuel Johnson", "Blessing Adeyemi"
];

const COMPLETED_TASKS_KEY = "finpas_completed_tasks";
const SPECIAL_OFFER_CLAIMED_KEY = "finpas_special_offer_claimed";
const FREE_TAPS_CLAIMED_KEY = 'finpas_free_taps_claimed';


function DashboardComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const account = searchParams.get("account");
  const phone = searchParams.get("phone");
  
  const { toast } = useToast();

  const [isMineInfoModalOpen, setIsMineInfoModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isWithdrawInfoModalOpen, setIsWithdrawInfoModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  
  const [balance, setBalance] = useState(0);
  const [tapsToday, setTapsToday] = useState(0);
  const [maxTaps, setMaxTaps] = useState(0);
  const [isMining, setIsMining] = useState(false);


  const [isClient, setIsClient] = useState(false);
  const [appUrl, setAppUrl] = useState("");
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [hasShown25kToast, setHasShown25kToast] = useState(false);
  const [showNewUserOffer, setShowNewUserOffer] = useState(false);
  const [offerTimeLeft, setOfferTimeLeft] = useState("");
  const [specialOfferClaimed, setSpecialOfferClaimed] = useState(false);
  const [freeTapsClaimed, setFreeTapsClaimed] = useState(false);


  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
        setAppUrl(window.location.origin);
        
        const storedVisibility = window.localStorage.getItem('isBalanceVisible');
        if (storedVisibility !== null) {
            setIsBalanceVisible(JSON.parse(storedVisibility));
        }

        const isFirstUserLogin = window.localStorage.getItem('isFirstUser') !== 'false';
        if (isFirstUserLogin) {
            setIsWelcomeModalOpen(true);
            // No need to set taps here, the welcome modal directs them
        }

        const purchasedTaps = parseInt(window.localStorage.getItem('purchasedTaps') || '0', 10);
        
        let availableTaps = MAX_FREE_TAPS + purchasedTaps;

        const storedTaps = parseInt(window.localStorage.getItem('tapsToday') || '0', 10);
        setTapsToday(storedTaps);
        setMaxTaps(availableTaps);
        
        if (localStorage.getItem(SPECIAL_OFFER_CLAIMED_KEY) === 'true') {
          setSpecialOfferClaimed(true);
        }

        if (localStorage.getItem(FREE_TAPS_CLAIMED_KEY) === 'true') {
          setFreeTapsClaimed(true);
        }

        const lastTapDate = window.localStorage.getItem('lastTapDate');
        const today = new Date().toISOString().split('T')[0];

        if (lastTapDate !== today) {
            window.localStorage.removeItem(COMPLETED_TASKS_KEY); 
            window.localStorage.removeItem(SPECIAL_OFFER_CLAIMED_KEY);
            window.localStorage.setItem('tapsToday', '0'); // Reset daily taps
            setTapsToday(0);
            setSpecialOfferClaimed(false);
        }

        const storedBalance = window.localStorage.getItem('balance');
        if (storedBalance) {
            const loadedBalance = parseFloat(storedBalance);
            setBalance(loadedBalance);
            if(loadedBalance >= 25000) {
                setHasShown25kToast(true); // Don't show toast again if already over 25k
            }
        }

        
        const newUserStartDateStr = window.localStorage.getItem('newUserStartDate');
        if (newUserStartDateStr) {
            const startDate = new Date(newUserStartDateStr);
            const threeDays = 3 * 24 * 60 * 60 * 1000;
            const now = new Date();
            if (now.getTime() - startDate.getTime() < threeDays) {
                setShowNewUserOffer(true);
                const endDate = new Date(startDate.getTime() + threeDays);

                const offerTimerInterval = setInterval(() => {
                    const diff = endDate.getTime() - new Date().getTime();
                    if (diff <= 0) {
                        setShowNewUserOffer(false);
                        clearInterval(offerTimerInterval);
                        return;
                    }
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    setOfferTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                }, 1000);
                return () => clearInterval(offerTimerInterval);
            }
        }
    }

     const notificationInterval = setInterval(() => {
        const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
        const randomAmount = Math.floor(Math.random() * (200000 - 50000 + 1)) + 50000;
        toast({
            title: "🎉 Withdrawal Successful!",
            description: `${randomName} just cashed out ${formatCurrency(randomAmount)}.`,
        });
    }, 60000); // 1 minute

    return () => {
        clearInterval(notificationInterval);
    }

  }, [toast]);

  // Effect to save balance and taps to localStorage whenever they change
  useEffect(() => {
    if (isClient) {
      window.localStorage.setItem('balance', balance.toString());
      window.localStorage.setItem('tapsToday', tapsToday.toString());
      window.localStorage.setItem('isBalanceVisible', JSON.stringify(isBalanceVisible));
      
      const params = new URLSearchParams(searchParams.toString());
      params.set("balance", balance.toString());
      params.set("taps", tapsToday.toString());
      window.history.replaceState(null, '', `?${params.toString()}`);
    }
  }, [balance, tapsToday, isClient, searchParams, isBalanceVisible]);


  const hasReachedMiningLimit = tapsToday >= maxTaps;

  const performMine = () => {
    if (hasReachedMiningLimit || isMining) {
        if (hasReachedMiningLimit) setIsUpgradeModalOpen(true);
        return;
    }
    
    setIsMining(true);
    try {
        const newBalance = balance + MINING_AMOUNT_PER_TAP;
        const newTapsCount = tapsToday + 1;

        setBalance(newBalance);
        setTapsToday(newTapsCount);
        addTransaction({
            type: "Mined",
            amount: MINING_AMOUNT_PER_TAP,
            status: "Completed",
        });

        const today = new Date().toISOString().split('T')[0];
        window.localStorage.setItem('lastTapDate', today);
        
        if (newBalance >= 25000 && !hasShown25kToast) {
            toast({
                title: "Congratulations!",
                description: "You have reached 25k! It's time to withdraw your money 💰",
                duration: 9000,
            });
            setHasShown25kToast(true);
        } else if(newTapsCount >= maxTaps) {
            toast({
                title: "Tap Limit Reached!",
                description: `You have used all your available taps.`,
                variant: "destructive",
            });
            setIsUpgradeModalOpen(true);
        } else {
            toast({
              title: "Mining Successful!",
              description: `You have successfully mined ${formatCurrency(MINING_AMOUNT_PER_TAP)}.`,
            });
        }
    } finally {
        setTimeout(() => setIsMining(false), 200); // Small delay to prevent spam clicking
    }
  }

  const handleMineClick = () => {
    performMine();
  };
  
  const handleWithdrawClick = () => {
    if (balance < MINIMUM_WITHDRAWAL) {
      setIsWithdrawInfoModalOpen(true);
    } else {
      router.push(getLinkWithParams('/dashboard/withdraw'));
    }
  }

  const getLinkWithParams = (pathname: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("balance", balance.toString());
    params.set("taps", tapsToday.toString());
    return `${pathname}?${params.toString()}`;
  }

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  }

  const handleWelcomeModalClose = () => {
      setIsWelcomeModalOpen(false);
      if (typeof window !== "undefined") {
          window.localStorage.setItem('isFirstUser', 'false');
      }
  }

  const withdrawalProgress = Math.min((balance / MINIMUM_WITHDRAWAL) * 100, 100);

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <div className="space-y-8">
        {showNewUserOffer && (
            <Card className="bg-green-100 border-green-400 text-green-800 animate-glow">
                 {specialOfferClaimed ? (
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <CheckCircle className="h-6 w-6 text-green-600" />
                           Offer Claimed!
                        </CardTitle>
                        <CardDescription className="text-green-700">
                           You've successfully claimed today's special offer. Come back tomorrow for new tasks and rewards!
                        </CardDescription>
                    </CardHeader>
                ) : (
                    <>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-6 w-6 text-yellow-500" />
                                New User Special Deal!
                            </CardTitle>
                            <CardDescription className="text-green-700">
                                For a limited time, complete simple tasks to get 10 extra taps for only {formatCurrency(100)}!
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-lg">Offer ends in:</p>
                                <p className="text-2xl font-mono">{offerTimeLeft}</p>
                            </div>
                            <LoadingLink href={getLinkWithParams('/dashboard/tasks')}>
                                <Button className="bg-green-600 hover:bg-green-700 text-white">
                                    Go to Tasks
                                </Button>
                            </LoadingLink>
                        </CardContent>
                    </>
                )}
            </Card>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2 bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    <span>Wallet Balance</span>
                 </div>
                 <Button variant="ghost" size="icon" onClick={toggleBalanceVisibility} className="h-8 w-8 hover:bg-primary/80">
                    {isBalanceVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                 </Button>
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">Your current available balance.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold tracking-tighter mb-2">
                {isBalanceVisible ? formatCurrency(balance) : "********"}
              </p>
               <div className="space-y-2">
                <Progress value={withdrawalProgress} className="h-2 bg-primary-foreground/20" />
                <div className="flex justify-between text-xs text-primary-foreground/80">
                  <span>{formatCurrency(balance)}</span>
                  <span>{formatCurrency(MINIMUM_WITHDRAWAL)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-transparent">
            <CardHeader>
              <CardTitle className="text-muted-foreground">User Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{name || "User"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span>{account || "0000000000"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{phone || "00000000000"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-transparent border-primary">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Manage your wallet and miners.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
            <Button
              className="flex h-20 flex-col gap-2"
              onClick={handleMineClick}
              disabled={hasReachedMiningLimit || isMining}
            >
              {isMining ? <Loader2 className="animate-spin h-6 w-6"/> : <Pickaxe className="h-6 w-6" />}
              <span>{isMining ? "Tapping..." : "Mine"}</span>
            </Button>
            <Button asChild className="flex h-20 flex-col gap-2 w-full">
                  <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={handleWithdrawClick}>
                      <Landmark className="h-6 w-6" />
                      <span>Withdraw</span>
                  </div>
              </Button>
            <LoadingLink href={getLinkWithParams('/dashboard/buy-miner')}>
              <Button asChild className={cn("flex h-20 flex-col gap-2 w-full", !freeTapsClaimed && "animate-glow")}>
                  <div className="flex flex-col items-center gap-2">
                      <CircleDollarSign className="h-6 w-6" />
                      <span>Buy Miner</span>
                  </div>
              </Button>
            </LoadingLink>
            <LoadingLink href={getLinkWithParams('/dashboard/transactions')}>
              <Button asChild className="flex h-20 flex-col gap-2 w-full">
                  <div className="flex flex-col items-center gap-2">
                      <History className="h-6 w-6" />
                      <span>History</span>
                  </div>
              </Button>
            </LoadingLink>
            <LoadingLink href={getLinkWithParams('/dashboard/tasks')}>
              <Button asChild className="flex h-20 flex-col gap-2 w-full">
                  <div className="flex flex-col items-center gap-2">
                      <Youtube className="h-6 w-6" />
                      <span>Tasks</span>
                  </div>
              </Button>
            </LoadingLink>
            <Button
              className="flex h-20 flex-col gap-1 py-2"
              onClick={() => setIsShareModalOpen(true)}
            >
              <Share2 className="h-6 w-6" />
              <div className="flex flex-col items-center">
                <span className="font-semibold">Share App</span>
                <p className="text-xs font-normal text-primary-foreground/80">Refer to get reward</p>
              </div>
            </Button>
            <LoadingLink href={getLinkWithParams('/dashboard/community')}>
                <Button asChild className="flex h-20 flex-col gap-2 w-full">
                    <div className="flex flex-col items-center gap-2">
                        <Users className="h-6 w-6" />
                        <span>Community</span>
                    </div>
                </Button>
            </LoadingLink>
            <LoadingLink href="https://ryuzagoncalves.com.br/ZW4vNHE1MTR1OFo5YzdFNXg=" target="_blank">
                <Button asChild className="flex h-20 flex-col gap-2 w-full">
                    <div className="flex flex-col items-center gap-2">
                        <Facebook className="h-6 w-6" />
                        <span>Support</span>
                    </div>
                </Button>
            </LoadingLink>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-primary">
            <CardHeader>
              <CardTitle>Miner Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
               <p className="text-lg">Your current plan: <span className="font-semibold text-primary">{maxTaps > MAX_FREE_TAPS ? "Upgraded Miner" : "Free Miner"}</span></p>
               <p className="text-muted-foreground">Taps used: {tapsToday} / {maxTaps}</p>
               <p className="text-muted-foreground">Amount mined: {formatCurrency(tapsToday * MINING_AMOUNT_PER_TAP)}</p>
            </CardContent>
          </Card>
      </div>

      <Dialog open={isMineInfoModalOpen} onOpenChange={setIsMineInfoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Mining</DialogTitle>
            <DialogDescription className="py-4">
              Each tap earns you {formatCurrency(MINING_AMOUNT_PER_TAP)}. You have {maxTaps - tapsToday} taps remaining.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => { setIsMineInfoModalOpen(false); performMine(); }}>Start Mining</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isWithdrawInfoModalOpen} onOpenChange={setIsWithdrawInfoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdrawal Information</DialogTitle>
            <DialogDescription className="py-4">
              The minimum withdrawal is {formatCurrency(MINIMUM_WITHDRAWAL)} daily. To earn more and reach the withdrawal threshold faster, you can purchase an auto miner.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsWithdrawInfoModalOpen(false)}>Cancel</Button>
            <LoadingLink href={getLinkWithParams('/dashboard/buy-miner')} passHref>
                <Button onClick={() => setIsWithdrawInfoModalOpen(false)}>Buy Auto Miner</Button>
            </LoadingLink>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tap Limit Reached</DialogTitle>
            <DialogDescription className="py-4">
              You've used all your available taps. Purchase more taps or complete tasks to continue mining.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsUpgradeModalOpen(false)}>Cancel</Button>
            <LoadingLink href={getLinkWithParams('/dashboard/buy-miner')} passHref>
                <Button onClick={() => setIsUpgradeModalOpen(false)}>Buy Taps</Button>
            </LoadingLink>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share App</DialogTitle>
            <DialogDescription className="py-4 text-center">
              Scan this QR code with another phone to open the app.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4 bg-white rounded-md">
            <QRCode value="https://myfin-two.vercel.app/" size={256} />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsShareModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isWelcomeModalOpen} onOpenChange={handleWelcomeModalClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to MyFin NG!</DialogTitle>
            <DialogDescription className="py-4">
              Get your free 10 taps on the Buy Miner page to start your journey.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleWelcomeModalClose}>Maybe Later</Button>
            <LoadingLink href={getLinkWithParams('/dashboard/buy-miner')} passHref>
                <Button onClick={handleWelcomeModalClose}>Get Free Taps</Button>
            </LoadingLink>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardComponent />
    </Suspense>
  );
}
